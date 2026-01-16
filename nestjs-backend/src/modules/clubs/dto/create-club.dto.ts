import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateClubDto {
  @IsNotEmpty({ message: 'Club name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsNotEmpty({ message: 'Admin ID is required' })
  @IsNumber()
  adminId: number;
}
