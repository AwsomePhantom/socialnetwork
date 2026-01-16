import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

export enum BorrowStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Entity('borrowed_books')
export class BorrowedBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id' })
  bookId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'returned_date', type: 'timestamp', nullable: true })
  returnedDate: Date;

  @Column({
    type: 'enum',
    enum: BorrowStatus,
    default: BorrowStatus.BORROWED,
  })
  status: BorrowStatus;

  @ManyToOne(() => Book, (book) => book.borrowedRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => User, (user) => user.borrowedBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'borrowed_date' })
  borrowedDate: Date;
}
