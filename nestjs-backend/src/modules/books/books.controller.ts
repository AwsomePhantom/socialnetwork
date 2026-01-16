import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../../entities/user.entity';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /api/books
   * Get all books
   */
  @Get()
  async findAll(@Query('search') search?: string) {
    return this.booksService.findAll(search);
  }

  /**
   * POST /api/books
   * Create a new book (Admin only)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.create(createBookDto);
    return { success: true, bookId: book.id };
  }

  /**
   * GET /api/books/borrowed
   * Get current user's borrowed books
   */
  @Get('borrowed')
  async getBorrowedBooks(@CurrentUser() user: User) {
    return this.booksService.getBorrowedBooks(user.id);
  }

  /**
   * POST /api/books/:id/borrow
   * Borrow a book
   */
  @Post(':id/borrow')
  async borrow(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.booksService.borrow(id, user.id);
  }

  /**
   * POST /api/books/:id/return
   * Return a book
   */
  @Post(':borrowId/return/:bookId')
  async returnBook(
    @Param('borrowId', ParseIntPipe) borrowId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.booksService.returnBook(borrowId, bookId);
  }

  /**
   * DELETE /api/books/:id
   * Delete a book (Admin only)
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.delete(id);
  }
}
