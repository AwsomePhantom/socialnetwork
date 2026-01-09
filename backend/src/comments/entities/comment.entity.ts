import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  post_id: number;

  @Column('text')
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User; 
}