import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Profile } from './profile.entity';
import { Post } from './post.entity';
import { ClubMember } from './club-member.entity';
import { Club } from './club.entity';
import { BorrowedBook } from './borrowed-book.entity';
import { Course } from './course.entity';
import { Message } from './message.entity';
import { ConversationMember } from './conversation-member.entity';

export enum UserRole {
  STUDENT = 'student',
  CLUB_ADMIN = 'club_admin',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', unique: true })
  studentId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_online', default: false })
  isOnline: boolean;

  @Column({ name: 'last_seen', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;

  // Remove unique constraint - just a regular nullable column
  @Column({ name: 'profile_id', nullable: true, type: 'int' })
  profileId: number;

  // Remove eager loading to prevent circular issues
  @OneToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => ClubMember, (clubMember) => clubMember.user)
  clubMemberships: ClubMember[];

  @OneToMany(() => Club, (club) => club.admin)
  adminClubs: Club[];

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.user)
  borrowedBooks: BorrowedBook[];

  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => ConversationMember, (member) => member.user)
  conversationMemberships: ConversationMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
