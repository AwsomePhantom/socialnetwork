import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'Conversation ID is required' })
  @IsNumber()
  conversationId: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
