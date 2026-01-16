import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'course_name' })
  courseName: string;

  @Column({ name: 'course_code', nullable: true })
  courseCode: string;

  @Column({ default: 3 })
  credits: number;

  @Column()
  grade: string;

  @Column({ name: 'grade_points', type: 'decimal', precision: 3, scale: 2 })
  gradePoints: number;

  @Column({ nullable: true })
  semester: string;

  @Column({ name: 'academic_year', nullable: true })
  academicYear: string;

  @ManyToOne(() => User, (user) => user.courses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
