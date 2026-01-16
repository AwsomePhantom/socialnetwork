import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users
   * Get all users (for messaging)
   */
  @Get()
  async findAll(@CurrentUser() currentUser: User) {
    return this.usersService.findAll(currentUser.id);
  }

  /**
   * GET /api/users/search?q=query
   * Search users by name or email
   */
  @Get('search')
  async search(
    @Query('q') query: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.search(query || '', currentUser.id);
  }

  /**
   * GET /api/users/:id
   * Get user by ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    const { password, ...result } = user as any;
    return result;
  }

  /**
   * PUT /api/users/:id
   * Update user profile
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    try {
      // Users can only update their own profile (unless admin)
      if (currentUser.id !== id && currentUser.role !== 'admin') {
        return { success: false, error: 'You can only update your own profile' };
      }

      console.log('Updating user:', id);
      console.log('Update data:', { 
        ...updateUserDto, 
        avatar: updateUserDto.avatar ? 'base64 image...' : 'no avatar' 
      });

      const result = await this.usersService.update(id, updateUserDto);
      
      console.log('Update result:', result.success);
      
      return result;
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  }
}
