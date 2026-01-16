import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../../entities/user.entity';
import { Profile } from '../../entities/profile.entity';
import { Club } from '../../entities/club.entity';
import { Post } from '../../entities/post.entity';
import { Book } from '../../entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Club, Post, Book]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
