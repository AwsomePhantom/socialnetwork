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
import { Club } from './club.entity';

export enum ClubMemberRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
}

@Entity('club_members')
@Unique(['clubId', 'userId'])
export class ClubMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'club_id' })
  clubId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ClubMemberRole,
    default: ClubMemberRole.MEMBER,
  })
  role: ClubMemberRole;

  @ManyToOne(() => Club, (club) => club.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @ManyToOne(() => User, (user) => user.clubMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
