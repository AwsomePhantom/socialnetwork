import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ConversationType } from '../../../entities/conversation.entity';

export class CreateConversationDto {
  @IsEnum(ConversationType)
  type: ConversationType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  userId?: number; // For direct messages

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  members?: number[]; // For group chats
}
