import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, NotFoundException, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId?: string,
  ) {
    const currentUserId = userId ? Number(userId) : undefined;
    return await this.postsService.findOne(id, currentUserId);
  }

  /**
   * GET /posts?userId=1
   * Retrieves the feed. Passing userId allows the backend to 
   * calculate if "isLiked" should be true or false for the current user.
   */
  @Get()
  async findAll(@Query('userId') userId: string) {
    // We convert query string to number. If no user, we pass undefined.
    const currentUserId = userId ? Number(userId) : undefined;
    return await this.postsService.findAll(currentUserId);
  }

  /**
   * POST /posts/:id/like
   * Body: { "userId": 1 }  // send the userId in the body
   * Toggles the like status for a specific post.
   */
  @Post(':id/like')
  async toggleLike(
    @Param('id', ParseIntPipe) postId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return await this.postsService.toggleLike(postId, userId);
  }

  /**
   * POST /posts
   * Body: { "userId": 1, "message": "Hello world" }
   * Creates a new post.
   */
  @Post()
  async createPost(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('message') message: string,
  ) {
    return await this.postsService.create(userId, message);
  }

  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: string, // Change @Body() to @Query()
  ) {
    // Now body is not involved, so it won't be undefined
    console.log('Delete Request for Post:', id, 'from User:', userId);
    return await this.postsService.remove(id, Number(userId));
  }
}