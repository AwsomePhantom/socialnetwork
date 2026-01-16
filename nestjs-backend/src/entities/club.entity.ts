import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ClubMember } from './club-member.entity';
import { ClubPost } from './club-post.entity';

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @Column({ name: 'members_count', default: 0 })
  membersCount: number;

  @Column({ name: 'admin_id' })
  adminId: number;

  @ManyToOne(() => User, (user) => user.adminClubs)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => ClubMember, (member) => member.club)
  members: ClubMember[];

  @OneToMany(() => ClubPost, (post) => post.club)
  posts: ClubPost[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
