import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * GET /api/courses
   * Get all courses for current user
   */
  @Get()
  async findAll(@CurrentUser() user: User) {
    return this.coursesService.findAll(user.id);
  }

  /**
   * GET /api/courses/cgpa
   * Calculate CGPA for current user
   */
  @Get('cgpa')
  async calculateCGPA(@CurrentUser() user: User) {
    return this.coursesService.calculateCGPA(user.id);
  }

  /**
   * POST /api/courses
   * Create a new course
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: User,
  ) {
    const course = await this.coursesService.create(createCourseDto, user);
    return { success: true, course };
  }

  /**
   * DELETE /api/courses/:id
   * Delete a course
   */
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.delete(id, user.id);
  }
}
