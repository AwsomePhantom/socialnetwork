// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profiles/entities/profile.entity';
import { User } from './users/entities/user.entity';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { Message } from './messages/entities/message.entity';
import { MessagesModule } from './messages/messages.module';
import { Post } from './posts/entities/posts.entity';
import { Like } from './likes/entities/likes.entity';
import { PostsModule } from './posts/posts.module';
import { Comment } from './comments/entities/comment.entity';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'swelab',
      entities: [Profile, User, Message, Post, Like, Comment],
      synchronize: true, // ONLY for development! Set to false in production.
    }),
    ProfilesModule,
    AuthModule,
    MessagesModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}