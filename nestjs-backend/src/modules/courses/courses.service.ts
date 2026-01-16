import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../entities/course.entity';
import { User } from '../../entities/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  // Grade points mapping
  private readonly gradePoints = {
    'A': 4.00,
    'A-': 3.70,
    'B+': 3.30,
    'B': 3.00,
    'B-': 2.70,
    'C+': 2.30,
    'C': 2.00,
    'C-': 1.70,
    'D': 1.00,
    'F': 0.00,
  };

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  /**
   * Get all courses for a user
   */
  async findAll(userId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Create a new course
   */
  async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
    const gradePoint = this.gradePoints[createCourseDto.grade] || 0;

    const course = this.courseRepository.create({
      userId: user.id,
      courseName: createCourseDto.courseName,
      courseCode: createCourseDto.courseCode,
      credits: createCourseDto.credits,
      grade: createCourseDto.grade,
      gradePoints: gradePoint,
      semester: createCourseDto.semester,
      academicYear: createCourseDto.academicYear,
    });

    return this.courseRepository.save(course);
  }

  /**
   * Delete a course
   */
  async delete(id: number, userId: number): Promise<{ success: boolean }> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.userId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.courseRepository.delete(id);
    return { success: true };
  }

  /**
   * Calculate CGPA for a user
   */
  async calculateCGPA(userId: number): Promise<{ cgpa: number; totalCredits: number; totalCourses: number }> {
    const courses = await this.courseRepository.find({
      where: { userId },
    });

    if (courses.length === 0) {
      return { cgpa: 0, totalCredits: 0, totalCourses: 0 };
    }

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      totalPoints += Number(course.gradePoints) * course.credits;
      totalCredits += course.credits;
    });

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return {
      cgpa: Math.round(cgpa * 100) / 100,
      totalCredits,
      totalCourses: courses.length,
    };
  }
}
