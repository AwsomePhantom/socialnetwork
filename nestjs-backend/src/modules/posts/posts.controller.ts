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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /api/posts
   * Get all posts
   */
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  /**
   * POST /api/posts
   * Create a new post (with optional image)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: User,
  ) {
    try {
      // Handle image URL from base64
      let imageUrl = createPostDto.imageUrl;
      
      if (imageUrl && imageUrl.startsWith('data:image')) {
        // Save base64 image to file
        imageUrl = await this.postsService.saveBase64Image(imageUrl);
      }

      const result = await this.postsService.create(
        { ...createPostDto, imageUrl },
        user,
      );
      
      return {
        success: true,
        postId: result.postId,
      };
    } catch (error) {
      console.error('Error creating post:', error);
      return {
        success: false,
        error: error.message || 'Failed to create post',
      };
    }
  }

  /**
   * DELETE /api/posts/:id
   * Delete a post
   */
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.delete(id, user.id);
  }

  /**
   * POST /api/posts/:id/like
   * Toggle like on a post
   */
  @Post(':id/like')
  async toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const result = await this.postsService.toggleLike(id, user.id);
    return { success: true, ...result };
  }

  /**
   * GET /api/posts/:id/comments
   * Get comments for a post
   */
  @Get(':id/comments')
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getComments(id);
  }

  /**
   * POST /api/posts/:id/comments
   * Add comment to a post
   */
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.postsService.addComment(id, createCommentDto, user);
    return { success: true, comment: result.comment };
  }

  /**
   * DELETE /api/posts/comments/:id
   * Delete a comment
   */
  @Delete('comments/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.deleteComment(id, user.id);
  }
}
