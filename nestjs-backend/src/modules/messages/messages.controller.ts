import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * GET /api/messages/conversations
   * Get all conversations
   */
  @Get('conversations')
  async getConversations(@CurrentUser() user: User) {
    return this.messagesService.getConversations(user.id);
  }

  /**
   * POST /api/messages/conversations
   * Create a new conversation
   */
  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @Body() createDto: CreateConversationDto,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.createConversation(createDto, user);
  }

  /**
   * GET /api/messages/conversations/:id
   * Get messages for a conversation
   */
  @Get('conversations/:id')
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.getMessages(id, user.id);
  }

  /**
   * POST /api/messages
   * Send a message
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Body() createDto: CreateMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.sendMessage(createDto, user);
  }

  /**
   * GET /api/messages/conversations/:id/settings
   * Get conversation settings
   */
  @Get('conversations/:id/settings')
  async getSettings(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.getSettings(id, user.id);
  }

  /**
   * PUT /api/messages/conversations/:id/settings
   * Update conversation settings
   */
  @Put('conversations/:id/settings')
  async updateSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateConversationDto,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.updateSettings(id, updateDto, user);
  }

  /**
   * DELETE /api/messages/conversations/:id
   * Leave a conversation
   */
  @Delete('conversations/:id')
  async leaveConversation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.leaveConversation(id, user.id);
  }
}
