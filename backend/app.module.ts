// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profiles/entities/profile.entity';
import { User } from './users/entities/user.entity';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { Message } from './messages/entities/message.entity';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'swelab',
      entities: [Profile, User, Message],
      synchronize: true, // ONLY for development! Set to false in production.
    }),
    ProfilesModule,
    AuthModule,
    MessagesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}