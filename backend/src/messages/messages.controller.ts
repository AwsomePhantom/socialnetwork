import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Note: senderId is explicitly included in the DTO for simplified authentication.
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    const { senderId } = createMessageDto;
    return this.messagesService.create(senderId, createMessageDto);
  }

  // GET /messages/chat/:senderId/:receiverId
  @Get('chat/:senderId/:receiverId')
  findConversation(
    @Param('senderId', ParseIntPipe) senderId: number,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ) {
    return this.messagesService.findConversation(senderId, receiverId);
  }
}