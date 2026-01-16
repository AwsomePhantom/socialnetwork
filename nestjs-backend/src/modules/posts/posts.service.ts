import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { PostLike } from '../../entities/post-like.entity';
import { PostComment } from '../../entities/post-comment.entity';
import { User } from '../../entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PostsService {
  private readonly uploadDir = './uploads';

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
  ) {
    // Ensure uploads directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save base64 image to file
   */
  async saveBase64Image(base64String: string): Promise<string> {
    if (!base64String || !base64String.startsWith('data:image')) {
      return base64String; // Return as-is if not base64
    }

    try {
      // Extract mime type and data
      const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        console.error('Invalid base64 format');
        return null;
      }

      const ext = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `post-${uniqueSuffix}.${ext}`;
      const filePath = join(this.uploadDir, filename);

      // Write file
      writeFileSync(filePath, buffer);
      console.log('Image saved to:', filePath);

      return `/uploads/${filename}`;
    } catch (error) {
      console.error('Failed to save image:', error);
      return null;
    }
  }

  // Get all posts with author info and avatar
  async findAll() {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('post.isApproved = :approved', { approved: true })
      .orderBy('post.createdAt', 'DESC')
      .take(50)
      .getMany();

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      userId: post.userId,
      authorName: post.user?.fullName || 'Unknown',
      authorAvatar: post.user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.fullName || 'user'}`,
    }));
  }

  // Create a new post
  async create(createPostDto: CreatePostDto, user: User) {
    try {
      const post = this.postRepository.create({
        content: createPostDto.content || '',
        imageUrl: createPostDto.imageUrl || null,
        userId: user.id,
      });
      
      const savedPost = await this.postRepository.save(post);
      console.log('Post created:', savedPost.id);
      
      return { success: true, postId: savedPost.id };
    } catch (error) {
      console.error('Error in create post:', error);
      throw error;
    }
  }

  // Delete a post
  async delete(id: number, userId: number) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Cannot delete this post');

    await this.postRepository.delete(id);
    return { success: true };
  }

  // Toggle like
  async toggleLike(postId: number, userId: number) {
    const existing = await this.postLikeRepository.findOne({
      where: { postId, userId },
    });

    if (existing) {
      await this.postLikeRepository.delete(existing.id);
      await this.postRepository.decrement({ id: postId }, 'likesCount', 1);
      return { success: true, liked: false };
    } else {
      const like = this.postLikeRepository.create({ postId, userId });
      await this.postLikeRepository.save(like);
      await this.postRepository.increment({ id: postId }, 'likesCount', 1);
      return { success: true, liked: true };
    }
  }

  // Get comments
  async getComments(postId: number) {
    const comments = await this.postCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('comment.postId = :postId', { postId })
      .orderBy('comment.createdAt', 'ASC')
      .getMany();

    return comments.map(c => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      userId: c.userId,
      authorName: c.user?.fullName || 'Unknown',
      authorAvatar: c.user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.fullName || 'user'}`,
    }));
  }

  // Add comment
  async addComment(postId: number, dto: CreateCommentDto, user: User) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.postCommentRepository.create({
      postId,
      userId: user.id,
      content: dto.content,
    });
    const saved = await this.postCommentRepository.save(comment);
    await this.postRepository.increment({ id: postId }, 'commentsCount', 1);

    return {
      success: true,
      comment: {
        id: saved.id,
        content: saved.content,
        createdAt: saved.createdAt,
        userId: user.id,
        authorName: user.fullName,
        authorAvatar: user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
      },
    };
  }

  // Delete comment
  async deleteComment(commentId: number, userId: number) {
    const comment = await this.postCommentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Cannot delete this comment');

    await this.postCommentRepository.delete(commentId);
    await this.postRepository.decrement({ id: comment.postId }, 'commentsCount', 1);

    return { success: true };
  }
}
