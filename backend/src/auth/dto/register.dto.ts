import { IsEmail, IsString, MinLength, IsDateString } from 'class-validator';

export class RegisterDto {
  // User details and Profile details
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsDateString()
  birthdate: string;

  // User details
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}