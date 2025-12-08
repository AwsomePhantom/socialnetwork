// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

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
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
