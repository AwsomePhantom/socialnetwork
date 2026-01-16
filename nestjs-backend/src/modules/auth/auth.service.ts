import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';
import { Profile } from '../../entities/profile.entity';
import { RegisterDto, RegisterClubAdminDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  // Register new student
  async register(dto: RegisterDto) {
    // Check if user exists
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { studentId: dto.studentId }],
    });
    if (existing) throw new ConflictException('User with this email or student ID already exists');

    // Create avatar URL
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.fullName)}`;

    // Create profile FIRST
    const profile = this.profileRepository.create({
      major: dto.major || '',
      bio: dto.bio || '',
      avatar: avatarUrl,
    });
    const savedProfile = await this.profileRepository.save(profile);

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user with profileId
    const user = this.userRepository.create({
      studentId: dto.studentId,
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      role: UserRole.STUDENT,
      profileId: savedProfile.id,
      isOnline: true,
      lastSeen: new Date(),
    });
    const savedUser = await this.userRepository.save(user);

    // Generate token
    const token = this.generateToken(savedUser);

    // Return user with profile (including avatar)
    return {
      success: true,
      token,
      user: {
        id: savedUser.id,
        studentId: savedUser.studentId,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        major: savedProfile.major,
        bio: savedProfile.bio,
        avatar: savedProfile.avatar,
        profile: savedProfile,
      },
    };
  }

  // Register club admin (admin only)
  async registerClubAdmin(dto: RegisterClubAdminDto, adminUser: User) {
    if (adminUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admin can create club admins');
    }

    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { studentId: dto.studentId }],
    });
    if (existing) throw new ConflictException('User with this email or ID already exists');

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.fullName)}`;

    // Create profile FIRST
    const profile = this.profileRepository.create({
      major: dto.major || '',
      bio: dto.bio || '',
      avatar: avatarUrl,
    });
    const savedProfile = await this.profileRepository.save(profile);

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create club admin user
    const user = this.userRepository.create({
      studentId: dto.studentId,
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      role: UserRole.CLUB_ADMIN,
      profileId: savedProfile.id,
    });
    const savedUser = await this.userRepository.save(user);

    const token = this.generateToken(savedUser);

    return {
      success: true,
      token,
      user: {
        id: savedUser.id,
        studentId: savedUser.studentId,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        avatar: savedProfile.avatar,
        profile: savedProfile,
      },
    };
  }

  // Login
  async login(dto: LoginDto) {
    // Find user with profile
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    // Verify password
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid email or password');

    // Update online status
    await this.userRepository.update(user.id, {
      isOnline: true,
      lastSeen: new Date(),
    });

    // Generate token
    const token = this.generateToken(user);

    // Return user with avatar from profile
    return {
      success: true,
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        major: user.profile?.major,
        bio: user.profile?.bio,
        avatar: user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
        profile: user.profile,
      },
    };
  }

  // Logout
  async logout(userId: number) {
    await this.userRepository.update(userId, {
      isOnline: false,
      lastSeen: new Date(),
    });
    return { success: true };
  }

  // Validate user from JWT
  async validateUser(payload: any) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id: payload.sub })
      .getOne();

    if (!user || !user.isActive) throw new UnauthorizedException('User not found or inactive');
    return user;
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
