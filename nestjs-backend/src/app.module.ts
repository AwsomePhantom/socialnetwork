import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { BooksModule } from './modules/books/books.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database - SYNCHRONIZE IS DISABLED - Use migrations
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'studenthub_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // ALWAYS FALSE - Database schema managed by SQL file
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    PostsModule,
    ClubsModule,
    BooksModule,
    MessagesModule,
    CoursesModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule {}
