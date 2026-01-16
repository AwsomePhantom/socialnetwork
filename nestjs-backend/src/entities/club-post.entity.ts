import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Club } from './club.entity';
import { ClubPostLike } from './club-post-like.entity';
import { ClubPostComment } from './club-post-comment.entity';

@Entity('club_posts')
export class ClubPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'club_id' })
  clubId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'likes_count', default: 0 })
  likesCount: number;

  @Column({ name: 'comments_count', default: 0 })
  commentsCount: number;

  @Column({ name: 'is_announcement', default: false })
  isAnnouncement: boolean;

  @ManyToOne(() => Club, (club) => club.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ClubPostLike, (like) => like.clubPost)
  likes: ClubPostLike[];

  @OneToMany(() => ClubPostComment, (comment) => comment.clubPost)
  comments: ClubPostComment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
