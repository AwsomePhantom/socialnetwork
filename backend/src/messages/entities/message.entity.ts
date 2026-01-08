import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: number; // sender user ID

  @Column()
  receiver: number; // receiver user ID

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @Column({ type: 'text', nullable: true })
  message: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender' })
  senderUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver' })
  receiverUser: User;
}