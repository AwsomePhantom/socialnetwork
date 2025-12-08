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
    private profilesRepository: Repository<Profile>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ profile: Profile; user: User }> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const newProfile = this.profilesRepository.create({
      name: registerDto.name,
      lastname: registerDto.lastname,
      birthdate: new Date(registerDto.birthdate),
    });
    const profile = await this.profilesRepository.save(newProfile);

    const newUser = this.usersRepository.create({
      profileId: profile.id,
      email: registerDto.email,
      password: registerDto.password,
    });
    const user = await this.usersRepository.save(newUser);

    return { profile, user };
  }

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }
}