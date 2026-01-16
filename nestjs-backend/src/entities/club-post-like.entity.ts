import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { ClubPost } from './club-post.entity';

@Entity('club_post_likes')
@Unique(['clubPostId', 'userId'])
export class ClubPostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'club_post_id' })
  clubPostId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => ClubPost, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club_post_id' })
  clubPost: ClubPost;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
