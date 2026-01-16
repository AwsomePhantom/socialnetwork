import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../entities/user.entity';

export class RegisterDto {
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  studentId: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  fullName: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

export class RegisterClubAdminDto extends RegisterDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.CLUB_ADMIN;
}
