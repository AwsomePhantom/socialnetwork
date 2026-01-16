import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Course name is required' })
  @IsString()
  courseName: string;

  @IsOptional()
  @IsString()
  courseCode?: string;

  @IsNotEmpty({ message: 'Credits is required' })
  @IsNumber()
  @Min(1)
  @Max(4)
  credits: number;

  @IsNotEmpty({ message: 'Grade is required' })
  @IsString()
  grade: string;

  @IsOptional()
  @IsString()
  semester?: string;

  @IsOptional()
  @IsString()
  academicYear?: string;
}
