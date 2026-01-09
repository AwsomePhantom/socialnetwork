import { Controller, Post, Get, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get('post/:postId')
  async getByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findAllByPost(postId);
  }

  @Post(':postId')
  async add(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: { userId: number; content: string },
  ) {
    return this.commentsService.create(postId, body.userId, body.content);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.commentsService.remove(id, userId);
  }
}