import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BorrowedBook } from './borrowed-book.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'total_copies', default: 1 })
  totalCopies: number;

  @Column({ name: 'available_copies', default: 1 })
  availableCopies: number;

  @Column({ nullable: true })
  category: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => BorrowedBook, (borrowed) => borrowed.book)
  borrowedRecords: BorrowedBook[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
