import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '../posts/entities/posts.entity';
import { Like } from '../likes/entities/likes.entity';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Module({
  // You must include User and Profile here because Post and Like relate to them
  imports: [TypeOrmModule.forFeature([Post, Like, User, Profile])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}