import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  /**
   * Creates and saves a new 1-to-1 message.
   * @param senderId The authenticated user's ID
   * @param createMessageDto The message payload
   */
  async create(senderId: number, createMessageDto: CreateMessageDto): Promise<Message> {
    const { receiverId, message } = createMessageDto;

    if (senderId === receiverId) {
      throw new ForbiddenException('Cannot send a message to yourself.');
    }

    const newMessage = this.messagesRepository.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    return this.messagesRepository.save(newMessage);
  }

  /**
   * Retrieves the full chat history between two users (bidirectional).
   * @param userId The authenticated user's ID
   * @param partnerId The ID of the other user in the conversation
   */
  async findConversation(userAId: number, userBId: number): Promise<Message[]> {
    // Finds messages where:
    // (sender = userAId AND receiver = userBId) OR (sender = userBId AND receiver = userAId)
    return this.messagesRepository.find({
      where: [
        { sender: userAId, receiver: userBId },
        { sender: userBId, receiver: userAId },
      ],
      order: {
        created: 'ASC', // Order by creation time
      },
    });
  }
}