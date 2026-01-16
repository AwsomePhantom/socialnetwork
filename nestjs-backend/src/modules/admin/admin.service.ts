import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';
import { Profile } from '../../entities/profile.entity';
import { Club } from '../../entities/club.entity';
import { Post } from '../../entities/post.entity';
import { Book } from '../../entities/book.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // ==================== STATS ====================
  async getStats() {
    const users = await this.userRepository.count({ where: { role: UserRole.STUDENT } });
    const clubAdmins = await this.userRepository.count({ where: { role: UserRole.CLUB_ADMIN } });
    const clubs = await this.clubRepository.count();
    const posts = await this.postRepository.count();
    const books = await this.bookRepository.count();

    return { users, clubAdmins, clubs, posts, books };
  }

  // ==================== USERS ====================
  async getAllUsers() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.role != :role', { role: UserRole.ADMIN })
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return users.map(user => ({
      id: user.id,
      studentId: user.studentId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      avatar: user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`,
      createdAt: user.createdAt,
    }));
  }

  async updateUserStatus(id: number, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === UserRole.ADMIN) throw new ForbiddenException('Cannot modify admin');

    await this.userRepository.update(id, { isActive });
    return { success: true, message: `User ${isActive ? 'activated' : 'deactivated'}` };
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === UserRole.ADMIN) throw new ForbiddenException('Cannot delete admin');

    await this.userRepository.delete(id);
    return { success: true, message: 'User deleted' };
  }

  async createClubAdmin(data: any) {
    const existing = await this.userRepository.findOne({
      where: [{ email: data.email }, { studentId: data.studentId }],
    });
    if (existing) throw new ConflictException('Email or ID already exists');

    // Create profile
    const profile = this.profileRepository.create({
      major: data.major || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName}`,
    });
    const savedProfile = await this.profileRepository.save(profile);

    // Create user
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      studentId: data.studentId,
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      role: UserRole.CLUB_ADMIN,
      profileId: savedProfile.id,
    });
    await this.userRepository.save(user);

    return { success: true, message: 'Club admin created' };
  }

  // ==================== POSTS ====================
  async getAllPosts() {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      authorName: post.user?.fullName || 'Unknown',
      authorAvatar: post.user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.fullName}`,
    }));
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    await this.postRepository.delete(id);
    return { success: true, message: 'Post deleted' };
  }

  // ==================== CLUBS ====================
  async getAllClubs() {
    const clubs = await this.clubRepository
      .createQueryBuilder('club')
      .leftJoinAndSelect('club.admin', 'admin')
      .orderBy('club.createdAt', 'DESC')
      .getMany();

    return clubs.map(club => ({
      id: club.id,
      name: club.name,
      description: club.description,
      imageUrl: club.imageUrl,
      membersCount: club.membersCount,
      isActive: club.isActive,
      adminName: club.admin?.fullName || 'Unknown',
      createdAt: club.createdAt,
    }));
  }

  async createClub(data: any) {
    const club = this.clubRepository.create({
      name: data.name,
      description: data.description || '',
      adminId: data.adminId,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
      coverImage: data.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    });
    await this.clubRepository.save(club);
    return { success: true, message: 'Club created' };
  }

  async updateClubStatus(id: number, isActive: boolean) {
    const club = await this.clubRepository.findOne({ where: { id } });
    if (!club) throw new NotFoundException('Club not found');

    await this.clubRepository.update(id, { isActive });
    return { success: true, message: `Club ${isActive ? 'activated' : 'deactivated'}` };
  }

  async deleteClub(id: number) {
    const club = await this.clubRepository.findOne({ where: { id } });
    if (!club) throw new NotFoundException('Club not found');

    await this.clubRepository.delete(id);
    return { success: true, message: 'Club deleted' };
  }

  async getClubAdmins() {
    const admins = await this.userRepository.find({
      where: { role: UserRole.CLUB_ADMIN, isActive: true },
    });
    return admins.map(a => ({ id: a.id, fullName: a.fullName, email: a.email }));
  }

  // ==================== BOOKS ====================
  async getAllBooks() {
    const books = await this.bookRepository.find({
      order: { createdAt: 'DESC' },
    });

    return books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      imageUrl: book.imageUrl,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      category: book.category,
      createdAt: book.createdAt,
    }));
  }

  async createBook(data: any) {
    const book = this.bookRepository.create({
      title: data.title,
      author: data.author,
      isbn: data.isbn || '',
      description: data.description || '',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      totalCopies: data.totalCopies || 1,
      availableCopies: data.totalCopies || 1,
      category: data.category || '',
    });
    await this.bookRepository.save(book);
    return { success: true, message: 'Book added' };
  }

  async deleteBook(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    await this.bookRepository.delete(id);
    return { success: true, message: 'Book deleted' };
  }
}
