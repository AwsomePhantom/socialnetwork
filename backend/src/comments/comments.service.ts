import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity'; // Make sure this is imported

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) { }

  async findAllByPost(postId: number) {
    return await this.commentRepo.query(`
    SELECT 
      c.id, 
      c.comment AS content,   -- Alias 'comment' to 'content'
      c.user_id, 
      c.post_id,
      c.created, 
      p.name AS userName 
    FROM comments c
    JOIN users u ON c.user_id = u.id
    JOIN profiles p ON u.profile_id = p.id
    WHERE c.post_id = ?
    ORDER BY c.created DESC
  `, [postId]);
  }

  async create(postId: number, userId: number, text: string) {
    const newComment = this.commentRepo.create({
      post_id: postId,
      user_id: userId,
      comment: text,
    });

    const result = await this.commentRepo.save(newComment);

    const raw = await this.commentRepo.query(`
      SELECT c.*, p.name as userName 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN profiles p ON u.profile_id = p.id
      WHERE c.id = ?
    `, [result.id]);

    return raw[0];
  }

  async remove(commentId: number, userId: number) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.user_id !== userId) {
      throw new UnauthorizedException('Access denied');
    }

    await this.commentRepo.delete(commentId);
    return { success: true };
  }
}