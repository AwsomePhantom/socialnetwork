import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== STATS ====================
  
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  // ==================== USERS ====================

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Post('users/club-admin')
  async createClubAdmin(@Body() data: any) {
    return this.adminService.createClubAdmin(data);
  }

  // ==================== POSTS ====================

  @Get('posts')
  async getAllPosts() {
    return this.adminService.getAllPosts();
  }

  @Delete('posts/:id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deletePost(id);
  }

  // ==================== CLUBS ====================

  @Get('clubs')
  async getAllClubs() {
    return this.adminService.getAllClubs();
  }

  @Post('clubs')
  async createClub(@Body() data: any) {
    return this.adminService.createClub(data);
  }

  @Put('clubs/:id')
  async updateClubStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateClubStatus(id, isActive);
  }

  @Delete('clubs/:id')
  async deleteClub(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteClub(id);
  }

  @Get('club-admins')
  async getClubAdmins() {
    return this.adminService.getClubAdmins();
  }

  // ==================== BOOKS ====================

  @Get('books')
  async getAllBooks() {
    return this.adminService.getAllBooks();
  }

  @Post('books')
  async createBook(@Body() data: any) {
    return this.adminService.createBook(data);
  }

  @Delete('books/:id')
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteBook(id);
  }
}
