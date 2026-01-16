import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from '../../entities/book.entity';
import { BorrowedBook } from '../../entities/borrowed-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BorrowedBook])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
