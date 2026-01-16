import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubPostDto } from './dto/create-club-post.dto';
import { CreateCommentDto } from '../posts/dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  /**
   * GET /api/clubs
   * Get all clubs
   */
  @Get()
  async findAll(@CurrentUser() user: User) {
    return this.clubsService.findAll(user.id);
  }

  /**
   * POST /api/clubs/:id/join
   * Join a club
   */
  @Post(':id/join')
  async join(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.clubsService.join(id, user.id);
  }

  /**
   * DELETE /api/clubs/:id/leave
   * Leave a club
   */
  @Delete(':id/leave')
  async leave(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.clubsService.leave(id, user.id);
  }

  /**
   * GET /api/clubs/:id/posts
   * Get club posts
   */
  @Get(':id/posts')
  async getPosts(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.clubsService.getPosts(id, user.id);
  }

  /**
   * POST /api/clubs/:id/posts
   * Create a club post (with optional image)
   */
  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreateClubPostDto,
    @CurrentUser() user: User,
  ) {
    try {
      // Handle image URL from base64
      let imageUrl = null;
      
      if (createPostDto.imageUrl && createPostDto.imageUrl.startsWith('data:image')) {
        // Save base64 image to file
        imageUrl = await this.clubsService.saveBase64Image(createPostDto.imageUrl);
        console.log('Saved club post image:', imageUrl);
      } else if (createPostDto.imageUrl) {
        imageUrl = createPostDto.imageUrl;
      }

      const result = await this.clubsService.createPost(id, createPostDto, imageUrl, user);
      
      return {
        success: true,
        postId: result.postId,
      };
    } catch (error) {
      console.error('Error creating club post:', error);
      return {
        success: false,
        error: error.message || 'Failed to create club post',
      };
    }
  }

  /**
   * POST /api/clubs/posts/:id/like
   * Toggle like on a club post
   */
  @Post('posts/:id/like')
  async toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const result = await this.clubsService.toggleLike(id, user.id);
    return { success: true, ...result };
  }

  /**
   * GET /api/clubs/posts/:id/comments
   * Get comments for a club post
   */
  @Get('posts/:id/comments')
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return this.clubsService.getComments(id);
  }

  /**
   * POST /api/clubs/posts/:id/comments
   * Add comment to a club post
   */
  @Post('posts/:id/comments')
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.clubsService.addComment(id, createCommentDto, user);
    return { success: true, comment: result.comment };
  }

  /**
   * DELETE /api/clubs/comments/:id
   * Delete a club post comment
   */
  @Delete('comments/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.clubsService.deleteComment(id, user.id);
  }
}
