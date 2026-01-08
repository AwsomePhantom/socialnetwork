import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Make sure this path is correct

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  bio: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  location: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  avatar: string | null;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}