import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../../entities/club.entity';
import { ClubMember } from '../../entities/club-member.entity';
import { ClubPost } from '../../entities/club-post.entity';
import { ClubPostLike } from '../../entities/club-post-like.entity';
import { ClubPostComment } from '../../entities/club-post-comment.entity';
import { User } from '../../entities/user.entity';
import { CreateClubPostDto } from './dto/create-club-post.dto';
import { CreateCommentDto } from '../posts/dto/create-comment.dto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ClubsService {
  private readonly uploadDir = './uploads';

  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    @InjectRepository(ClubMember)
    private clubMemberRepository: Repository<ClubMember>,
    @InjectRepository(ClubPost)
    private clubPostRepository: Repository<ClubPost>,
    @InjectRepository(ClubPostLike)
    private clubPostLikeRepository: Repository<ClubPostLike>,
    @InjectRepository(ClubPostComment)
    private clubPostCommentRepository: Repository<ClubPostComment>,
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
      const filename = `club-post-${uniqueSuffix}.${ext}`;
      const filePath = join(this.uploadDir, filename);

      // Write file
      writeFileSync(filePath, buffer);
      console.log('Club post image saved to:', filePath);

      return `/uploads/${filename}`;
    } catch (error) {
      console.error('Failed to save club post image:', error);
      return null;
    }
  }

  // Get all clubs
  async findAll(userId: number) {
    const clubs = await this.clubRepository
      .createQueryBuilder('club')
      .leftJoinAndSelect('club.admin', 'admin')
      .leftJoinAndSelect('admin.profile', 'adminProfile')
      .where('club.isActive = :isActive', { isActive: true })
      .orderBy('club.membersCount', 'DESC')
      .getMany();

    const memberships = await this.clubMemberRepository.find({ where: { userId } });
    const membershipMap = new Map(memberships.map(m => [m.clubId, true]));

    return clubs.map(club => ({
      id: club.id,
      name: club.name,
      description: club.description,
      imageUrl: club.imageUrl,
      coverImage: club.coverImage,
      membersCount: club.membersCount,
      adminId: club.adminId,
      adminName: club.admin?.fullName,
      isMember: membershipMap.has(club.id),
      isAdmin: club.adminId === userId,
    }));
  }

  // Join club
  async join(clubId: number, userId: number) {
    const club = await this.clubRepository.findOne({ where: { id: clubId } });
    if (!club) throw new NotFoundException('Club not found');

    const existing = await this.clubMemberRepository.findOne({ where: { clubId, userId } });
    if (existing) throw new BadRequestException('Already a member');

    const member = this.clubMemberRepository.create({ clubId, userId });
    await this.clubMemberRepository.save(member);
    await this.clubRepository.increment({ id: clubId }, 'membersCount', 1);

    return { success: true };
  }

  // Leave club
  async leave(clubId: number, userId: number) {
    const member = await this.clubMemberRepository.findOne({ where: { clubId, userId } });
    if (!member) throw new BadRequestException('Not a member');

    await this.clubMemberRepository.delete(member.id);
    await this.clubRepository.decrement({ id: clubId }, 'membersCount', 1);

    return { success: true };
  }

  // Check access
  async checkAccess(clubId: number, userId: number): Promise<boolean> {
    const club = await this.clubRepository.findOne({ where: { id: clubId } });
    if (!club) return false;
    if (club.adminId === userId) return true;

    const member = await this.clubMemberRepository.findOne({ where: { clubId, userId } });
    return !!member;
  }

  // Get club posts
  async getPosts(clubId: number, userId: number) {
    const hasAccess = await this.checkAccess(clubId, userId);
    if (!hasAccess) throw new ForbiddenException('Must be a member to view posts');

    const club = await this.clubRepository.findOne({ where: { id: clubId } });

    const posts = await this.clubPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('post.clubId = :clubId', { clubId })
      .orderBy('post.isAnnouncement', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      isAnnouncement: post.isAnnouncement,
      createdAt: post.createdAt,
      userId: post.userId,
      authorName: post.user?.fullName || 'Unknown',
      authorAvatar: post.user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.fullName || 'user'}`,
      isAdminPost: post.userId === club?.adminId,
    }));
  }

  // Create club post
  async createPost(clubId: number, dto: CreateClubPostDto, imageUrl: string | null, user: User) {
    const hasAccess = await this.checkAccess(clubId, user.id);
    if (!hasAccess) throw new ForbiddenException('Must be a member to post');

    const club = await this.clubRepository.findOne({ where: { id: clubId } });
    const isAnnouncement = dto.isAnnouncement && club?.adminId === user.id;

    const post = this.clubPostRepository.create({
      clubId,
      userId: user.id,
      content: dto.content || '',
      imageUrl: imageUrl,
      isAnnouncement,
    });
    const saved = await this.clubPostRepository.save(post);

    return { success: true, postId: saved.id };
  }

  // Toggle like on club post
  async toggleLike(postId: number, userId: number) {
    const existing = await this.clubPostLikeRepository.findOne({
      where: { clubPostId: postId, userId },
    });

    if (existing) {
      await this.clubPostLikeRepository.delete(existing.id);
      await this.clubPostRepository.decrement({ id: postId }, 'likesCount', 1);
      return { success: true, liked: false };
    } else {
      const like = this.clubPostLikeRepository.create({ clubPostId: postId, userId });
      await this.clubPostLikeRepository.save(like);
      await this.clubPostRepository.increment({ id: postId }, 'likesCount', 1);
      return { success: true, liked: true };
    }
  }

  // Get comments for club post
  async getComments(postId: number) {
    const comments = await this.clubPostCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('comment.clubPostId = :postId', { postId })
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

  // Add comment to club post
  async addComment(postId: number, dto: CreateCommentDto, user: User) {
    const post = await this.clubPostRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.clubPostCommentRepository.create({
      clubPostId: postId,
      userId: user.id,
      content: dto.content,
    });
    const saved = await this.clubPostCommentRepository.save(comment);
    await this.clubPostRepository.increment({ id: postId }, 'commentsCount', 1);

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
    const comment = await this.clubPostCommentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Cannot delete this comment');

    await this.clubPostCommentRepository.delete(commentId);
    await this.clubPostRepository.decrement({ id: comment.clubPostId }, 'commentsCount', 1);

    return { success: true };
  }
}
