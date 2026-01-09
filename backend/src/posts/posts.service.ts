import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/posts.entity';
import { Like } from '../likes/entities/likes.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepo: Repository<Post>,
    @InjectRepository(Like) private likesRepo: Repository<Like>,
  ) {}

  async findOne(postId: number, currentUserId?: number) {
  const post = await this.postsRepo.findOne({
    where: { id: postId },
    relations: ['user', 'user.profile', 'likes'],
  });

  if (!post) {
    throw new NotFoundException(`Post with ID ${postId} not found`);
  }

  // Format the response to match your React Native state
  return {
    id: post.id,
    user: `${post.user.profile.name} ${post.user.profile.lastname}`,
    content: post.message,
    likes: post.likes ? post.likes.length : 0,
    time: post.created,
    isLiked: currentUserId 
      ? post.likes.some(l => l.userId === currentUserId) 
      : false,
  };
}

async findAll(currentUserId?: number) {
  return await this.postsRepo.query(`
    SELECT 
      p.id as id,           -- This is the Post ID
      p.user_id as user_id, -- This is the User ID (Owner)
      p.message as content, 
      p.created as time, 
      prof.name as user,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes,
      EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) as isLiked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    JOIN profiles prof ON u.profile_id = prof.id
    ORDER BY p.created DESC
  `, [currentUserId]);
}

  async toggleLike(postId: number, userId: number) {
    // Check if the post exists first
    const post = await this.postsRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    // Check if the like already exists
    const existingLike = await this.likesRepo.findOne({
      where: { postId: postId, userId: userId },
    });

    if (existingLike) {
      // If it exists, remove it (Unlike)
      await this.likesRepo.remove(existingLike);
      return { liked: false };
    } else {
      // If it doesn't exist, create it (Like)
      const newLike = this.likesRepo.create({ postId, userId });
      await this.likesRepo.save(newLike);
      return { liked: true };
    }
  }

  // Create a New Post
  async create(userId: number, message: string) {
    const newPost = this.postsRepo.create({
      userId: userId,
      message: message,
    });
    
    const savedPost = await this.postsRepo.save(newPost);
    
    // Return formatted for React Native context
    return {
      id: savedPost.id,
      content: savedPost.message,
      time: savedPost.created,
      likes: 0,
      isLiked: false
    };
  }

  async remove(id: number, userId: number) {
  const post = await this.postsRepo.findOne({ where: { id }, relations: ['user'] });
  
  if (!post) throw new NotFoundException('Post not found');
  if (post.user.id !== userId) throw new UnauthorizedException('You can only delete your own posts');

  await this.postsRepo.remove(post);
  return { success: true };
}


}
