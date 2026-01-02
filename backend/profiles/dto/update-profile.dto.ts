import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string; // We use string here and convert in the service

  @IsOptional()
  @IsString()
  avatar?: string;
}