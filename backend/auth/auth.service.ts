import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ profile: Profile; user: User }> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Explicitly type the creation to prevent the 'Profile[]' error
 const profileData: Partial<Profile> = {
      name: registerDto.name,
      lastname: registerDto.lastname,
      birthdate: new Date(registerDto.birthdate),
      bio: registerDto.bio ?? null,      // ?? null is now allowed
      location: registerDto.location ?? null, 
    };

    const profileInstance = this.profilesRepository.create(profileData);
    const profile = await this.profilesRepository.save(profileInstance);

    const userInstance = this.usersRepository.create({
      profileId: profile.id, 
      email: registerDto.email,
      password: registerDto.password,
    });
    const user = await this.usersRepository.save(userInstance);

    return { profile, user };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { 
        email: loginDto.email, 
        password: loginDto.password 
      },
      relations: ['profile'], 
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.profile?.name,
      lastname: user.profile?.lastname,
      birthdate: user.profile?.birthdate,
      avatar: user.profile?.avatar,
      bio: user.profile?.bio,
      location: user.profile?.location,
    };
  }
}