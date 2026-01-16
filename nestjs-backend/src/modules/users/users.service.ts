import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Profile } from '../../entities/profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
  private readonly uploadDir = './uploads';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {
    // Ensure uploads directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save base64 image to file
   */
  saveBase64Image(base64String: string): string {
    if (!base64String || !base64String.startsWith('data:image')) {
      return base64String; // Return as-is if not base64
    }

    try {
      // Extract mime type and data
      const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        console.error('Invalid base64 format');
        return null;
      }

      const ext = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `avatar-${uniqueSuffix}.${ext}`;
      const filePath = join(this.uploadDir, filename);

      // Write file
      writeFileSync(filePath, buffer);
      console.log('Avatar saved to:', filePath);

      return `/uploads/${filename}`;
    } catch (error) {
      console.error('Failed to save avatar:', error);
      return null;
    }
  }

  // Get all users (for messenger - excludes current user and admins)
  async findAll(currentUserId: number) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id != :currentUserId', { currentUserId })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.role != :adminRole', { adminRole: UserRole.ADMIN })
      .orderBy('user.fullName', 'ASC')
      .getMany();

    return users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isOnline: user.isOnline,
      avatar: user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
    }));
  }

  // Get user by ID
  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      studentId: user.studentId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isOnline: user.isOnline,
      major: user.profile?.major,
      bio: user.profile?.bio,
      avatar: user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
      profile: user.profile,
    };
  }

  // Update user profile
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    // Check email uniqueness
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('Email already in use');
    }

    // Update user fields
    if (dto.fullName) user.fullName = dto.fullName;
    if (dto.email) user.email = dto.email;
    await this.userRepository.save(user);

    // Update or create profile
    if (!user.profile) {
      // Create profile if doesn't exist
      const newProfile = this.profileRepository.create({
        major: dto.major || '',
        bio: dto.bio || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
      });
      const savedProfile = await this.profileRepository.save(newProfile);
      user.profileId = savedProfile.id;
      await this.userRepository.save(user);
      user.profile = savedProfile;
    }

    // Handle avatar upload
    if (dto.avatar) {
      if (dto.avatar.startsWith('data:image')) {
        // Save base64 image to file
        const savedPath = this.saveBase64Image(dto.avatar);
        if (savedPath) {
          user.profile.avatar = savedPath;
        }
      } else {
        user.profile.avatar = dto.avatar;
      }
    }

    // Update other profile fields
    if (dto.major !== undefined) user.profile.major = dto.major;
    if (dto.bio !== undefined) user.profile.bio = dto.bio;
    if (dto.phoneNumber !== undefined) user.profile.phoneNumber = dto.phoneNumber;
    if (dto.address !== undefined) user.profile.address = dto.address;

    await this.profileRepository.save(user.profile);

    return {
      success: true,
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

  // Search users
  async search(query: string, currentUserId: number) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id != :currentUserId', { currentUserId })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.role != :adminRole', { adminRole: UserRole.ADMIN })
      .andWhere('(user.fullName LIKE :query OR user.email LIKE :query)', { query: `%${query}%` })
      .orderBy('user.fullName', 'ASC')
      .getMany();

    return users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isOnline: user.isOnline,
      avatar: user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
    }));
  }
}
