import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from '../../entities/book.entity';
import { BorrowedBook, BorrowStatus } from '../../entities/borrowed-book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BorrowedBook)
    private readonly borrowedBookRepository: Repository<BorrowedBook>,
  ) {}

  /**
   * Get all books
   */
  async findAll(search?: string): Promise<Book[]> {
    const where: any = { isActive: true };

    if (search) {
      return this.bookRepository
        .createQueryBuilder('book')
        .where('book.isActive = :isActive', { isActive: true })
        .andWhere(
          '(book.title LIKE :search OR book.author LIKE :search)',
          { search: `%${search}%` },
        )
        .orderBy('book.title', 'ASC')
        .getMany();
    }

    return this.bookRepository.find({
      where,
      order: { title: 'ASC' },
    });
  }

  /**
   * Create a new book (Admin only)
   */
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create({
      ...createBookDto,
      availableCopies: createBookDto.totalCopies || 1,
    });
    return this.bookRepository.save(book);
  }

  /**
   * Borrow a book
   */
  async borrow(
    bookId: number,
    userId: number,
  ): Promise<{ success: boolean; dueDate: string }> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException('Book not available');
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create borrow record
    const borrowRecord = this.borrowedBookRepository.create({
      bookId,
      userId,
      dueDate,
      status: BorrowStatus.BORROWED,
    });

    await this.borrowedBookRepository.save(borrowRecord);

    // Update available copies
    await this.bookRepository.decrement({ id: bookId }, 'availableCopies', 1);

    return {
      success: true,
      dueDate: dueDate.toISOString().split('T')[0],
    };
  }

  /**
   * Return a book
   */
  async returnBook(
    borrowId: number,
    bookId: number,
  ): Promise<{ success: boolean }> {
    const borrowRecord = await this.borrowedBookRepository.findOne({
      where: { id: borrowId },
    });

    if (!borrowRecord) {
      throw new NotFoundException('Borrow record not found');
    }

    // Update borrow record
    borrowRecord.status = BorrowStatus.RETURNED;
    borrowRecord.returnedDate = new Date();
    await this.borrowedBookRepository.save(borrowRecord);

    // Update available copies
    await this.bookRepository.increment({ id: bookId }, 'availableCopies', 1);

    return { success: true };
  }

  /**
   * Get borrowed books for a user
   */
  async getBorrowedBooks(userId: number): Promise<any[]> {
    const records = await this.borrowedBookRepository
      .createQueryBuilder('borrow')
      .leftJoinAndSelect('borrow.book', 'book')
      .where('borrow.userId = :userId', { userId })
      .andWhere('borrow.status = :status', { status: BorrowStatus.BORROWED })
      .orderBy('borrow.dueDate', 'ASC')
      .getMany();

    return records.map((record) => ({
      id: record.id,
      bookId: record.bookId,
      title: record.book?.title,
      author: record.book?.author,
      imageUrl: record.book?.imageUrl,
      dueDate: record.dueDate,
      borrowedDate: record.borrowedDate,
    }));
  }

  /**
   * Delete a book (Admin only)
   */
  async delete(id: number): Promise<{ success: boolean }> {
    await this.bookRepository.delete(id);
    return { success: true };
  }
}
