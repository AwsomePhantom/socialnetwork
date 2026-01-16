import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Comment content is required' })
  @IsString()
  content: string;
}
