import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { Club } from '../../entities/club.entity';
import { ClubMember } from '../../entities/club-member.entity';
import { ClubPost } from '../../entities/club-post.entity';
import { ClubPostLike } from '../../entities/club-post-like.entity';
import { ClubPostComment } from '../../entities/club-post-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Club,
      ClubMember,
      ClubPost,
      ClubPostLike,
      ClubPostComment,
    ]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
