import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterClubAdminDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/register
   * Register a new student
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Registration successful',
      ...result,
    };
  }

  /**
   * POST /api/auth/register-club-admin
   * Register a new club admin (Admin only)
   */
  @Post('register-club-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async registerClubAdmin(
    @Body() registerDto: RegisterClubAdminDto,
    @Request() req,
  ) {
    const result = await this.authService.registerClubAdmin(registerDto, req.user);
    return {
      success: true,
      message: 'Club admin created successfully',
      ...result,
    };
  }

  /**
   * POST /api/auth/login
   * Login user
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Login successful',
      ...result,
    };
  }

  /**
   * POST /api/auth/logout
   * Logout user
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return {
      success: true,
      message: 'Logout successful',
    };
  }
}
