import { IsInt, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  senderId: number;
  receiverId: number; 

  @IsString()
  @IsNotEmpty()
  @MaxLength(64000)
  message: string;
}