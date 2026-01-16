import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationType } from '../../entities/conversation.entity';
import { ConversationMember, ConversationMemberRole } from '../../entities/conversation-member.entity';
import { Message, MessageType } from '../../entities/message.entity';
import { User } from '../../entities/user.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateConversationDto, ConversationAction } from './dto/update-conversation.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationMember)
    private memberRepository: Repository<ConversationMember>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Get all conversations for user
  async getConversations(userId: number) {
    const memberships = await this.memberRepository
      .createQueryBuilder('cm')
      .leftJoinAndSelect('cm.conversation', 'conv')
      .leftJoinAndSelect('conv.members', 'members')
      .leftJoinAndSelect('members.user', 'memberUser')
      .leftJoinAndSelect('memberUser.profile', 'memberProfile')
      .where('cm.userId = :userId', { userId })
      .andWhere('cm.isActive = :isActive', { isActive: true })
      .orderBy('conv.lastMessageAt', 'DESC')
      .getMany();

    const conversations = await Promise.all(
      memberships.map(async (membership) => {
        const conv = membership.conversation;

        // Get last message
        const lastMessage = await this.messageRepository.findOne({
          where: { conversationId: conv.id, isDeleted: false },
          order: { createdAt: 'DESC' },
        });

        // Get unread count
        const unreadCount = await this.messageRepository
          .createQueryBuilder('m')
          .where('m.conversationId = :convId', { convId: conv.id })
          .andWhere('m.createdAt > :lastRead', { lastRead: membership.lastReadAt })
          .andWhere('m.senderId != :userId', { userId })
          .andWhere('m.isDeleted = :isDeleted', { isDeleted: false })
          .getCount();

        // Get display info
        let displayName = conv.name;
        let displayAvatar = conv.imageUrl;
        let isOnline = false;

        if (conv.type === ConversationType.DIRECT) {
          const otherMember = conv.members?.find(m => m.userId !== userId && m.isActive);
          if (otherMember?.user) {
            displayName = otherMember.user.fullName;
            displayAvatar = otherMember.user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherMember.user.fullName}`;
            isOnline = otherMember.user.isOnline;
          }
        }

        return {
          id: conv.id,
          type: conv.type,
          name: conv.name,
          imageUrl: conv.imageUrl,
          displayName,
          displayAvatar: displayAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${conv.id}`,
          isOnline,
          lastMessage: lastMessage?.content || '',
          unreadCount,
          lastMessageAt: conv.lastMessageAt,
        };
      }),
    );

    return conversations;
  }

  // Create conversation
  async createConversation(dto: CreateConversationDto, user: User) {
    if (dto.type === ConversationType.DIRECT) {
      if (!dto.userId) throw new BadRequestException('User ID required for direct message');

      // Check if already exists
      const existing = await this.memberRepository
        .createQueryBuilder('cm1')
        .innerJoin(ConversationMember, 'cm2', 'cm1.conversationId = cm2.conversationId')
        .innerJoin('cm1.conversation', 'conv')
        .where('cm1.userId = :userId1', { userId1: user.id })
        .andWhere('cm2.userId = :userId2', { userId2: dto.userId })
        .andWhere('conv.type = :type', { type: ConversationType.DIRECT })
        .getOne();

      if (existing) {
        return { success: true, conversationId: existing.conversationId };
      }

      // Create new
      const conv = this.conversationRepository.create({
        type: ConversationType.DIRECT,
        createdBy: user.id,
      });
      const saved = await this.conversationRepository.save(conv);

      await this.memberRepository.save([
        { conversationId: saved.id, userId: user.id, role: ConversationMemberRole.MEMBER },
        { conversationId: saved.id, userId: dto.userId, role: ConversationMemberRole.MEMBER },
      ]);

      return { success: true, conversationId: saved.id };
    } else {
      // Group chat
      if (!dto.name) throw new BadRequestException('Group name required');

      const conv = this.conversationRepository.create({
        type: ConversationType.GROUP,
        name: dto.name,
        imageUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${dto.name}`,
        createdBy: user.id,
      });
      const saved = await this.conversationRepository.save(conv);

      // Add creator as admin
      await this.memberRepository.save({
        conversationId: saved.id,
        userId: user.id,
        role: ConversationMemberRole.ADMIN,
      });

      // Add other members
      if (dto.members?.length) {
        const memberEntities = dto.members
          .filter(id => id !== user.id)
          .map(memberId => ({
            conversationId: saved.id,
            userId: memberId,
            role: ConversationMemberRole.MEMBER,
          }));
        await this.memberRepository.save(memberEntities);
      }

      // System message
      await this.messageRepository.save({
        conversationId: saved.id,
        senderId: user.id,
        content: `${user.fullName} created the group "${dto.name}"`,
        messageType: MessageType.SYSTEM,
      });

      return { success: true, conversationId: saved.id };
    }
  }

  // Get messages
  async getMessages(conversationId: number, userId: number) {
    const membership = await this.memberRepository.findOne({
      where: { conversationId, userId, isActive: true },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const messages = await this.messageRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.sender', 'sender')
      .leftJoinAndSelect('sender.profile', 'profile')
      .where('m.conversationId = :conversationId', { conversationId })
      .andWhere('m.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('m.createdAt', 'ASC')
      .getMany();

    // Update last read
    await this.memberRepository.update(
      { conversationId, userId },
      { lastReadAt: new Date() },
    );

    return messages.map(m => ({
      id: m.id,
      content: m.content,
      imageUrl: m.imageUrl,
      messageType: m.messageType,
      createdAt: m.createdAt,
      senderId: m.senderId,
      senderName: m.sender?.fullName || 'Unknown',
      senderAvatar: m.sender?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.sender?.fullName || 'user'}`,
    }));
  }

  // Send message
  async sendMessage(dto: CreateMessageDto, user: User) {
    const membership = await this.memberRepository.findOne({
      where: { conversationId: dto.conversationId, userId: user.id, isActive: true },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const messageType = dto.imageUrl ? MessageType.IMAGE : MessageType.TEXT;

    const message = this.messageRepository.create({
      conversationId: dto.conversationId,
      senderId: user.id,
      content: dto.content || '',
      imageUrl: dto.imageUrl,
      messageType,
    });
    const saved = await this.messageRepository.save(message);

    // Update conversation
    await this.conversationRepository.update(dto.conversationId, {
      lastMessageId: saved.id,
      lastMessageAt: new Date(),
    });

    // Update sender's last read
    await this.memberRepository.update(
      { conversationId: dto.conversationId, userId: user.id },
      { lastReadAt: new Date() },
    );

    return { success: true, messageId: saved.id };
  }

  // Get settings
  async getSettings(conversationId: number, userId: number) {
    const membership = await this.memberRepository.findOne({
      where: { conversationId, userId, isActive: true },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const conv = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    const members = await this.memberRepository
      .createQueryBuilder('cm')
      .leftJoinAndSelect('cm.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('cm.conversationId = :conversationId', { conversationId })
      .andWhere('cm.isActive = :isActive', { isActive: true })
      .getMany();

    return {
      id: conv.id,
      type: conv.type,
      name: conv.name,
      imageUrl: conv.imageUrl,
      myRole: membership.role,
      isMuted: membership.isMuted,
      members: members.map(m => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        fullName: m.user?.fullName,
        avatar: m.user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.fullName || 'user'}`,
        isOnline: m.user?.isOnline,
      })),
    };
  }

  // Update settings
  async updateSettings(conversationId: number, dto: UpdateConversationDto, user: User) {
    const membership = await this.memberRepository.findOne({
      where: { conversationId, userId: user.id, isActive: true },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    switch (dto.action) {
      case ConversationAction.MUTE:
        await this.memberRepository.update(membership.id, { isMuted: dto.muted });
        break;

      case ConversationAction.RENAME:
        if (membership.role !== ConversationMemberRole.ADMIN) throw new ForbiddenException('Admin only');
        await this.conversationRepository.update(conversationId, { name: dto.name });
        await this.addSystemMessage(conversationId, user.id, `${user.fullName} renamed the group to "${dto.name}"`);
        break;

      case ConversationAction.ADD_MEMBER:
        if (membership.role !== ConversationMemberRole.ADMIN) throw new ForbiddenException('Admin only');
        await this.addMember(conversationId, dto.memberId, user);
        break;

      case ConversationAction.REMOVE_MEMBER:
        if (membership.role !== ConversationMemberRole.ADMIN) throw new ForbiddenException('Admin only');
        await this.removeMember(conversationId, dto.memberId, user);
        break;

      case ConversationAction.MAKE_ADMIN:
        if (membership.role !== ConversationMemberRole.ADMIN) throw new ForbiddenException('Admin only');
        await this.memberRepository.update(
          { conversationId, userId: dto.memberId },
          { role: ConversationMemberRole.ADMIN },
        );
        const newAdmin = await this.userRepository.findOne({ where: { id: dto.memberId } });
        await this.addSystemMessage(conversationId, user.id, `${newAdmin?.fullName || 'A member'} is now an admin`);
        break;
    }

    return { success: true };
  }

  // Leave conversation
  async leaveConversation(conversationId: number, userId: number) {
    const membership = await this.memberRepository.findOne({
      where: { conversationId, userId, isActive: true },
    });
    if (!membership) throw new NotFoundException('Membership not found');

    const conv = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (conv.type === ConversationType.DIRECT) {
      await this.memberRepository.update(membership.id, { isActive: false });
    } else {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      await this.memberRepository.update(membership.id, { isActive: false, leftAt: new Date() });
      await this.addSystemMessage(conversationId, userId, `${user?.fullName || 'A member'} left the group`);
    }

    return { success: true };
  }

  private async addMember(conversationId: number, memberId: number, user: User) {
    const existing = await this.memberRepository.findOne({
      where: { conversationId, userId: memberId },
    });

    if (existing) {
      if (!existing.isActive) {
        await this.memberRepository.update(existing.id, { isActive: true, leftAt: null });
      }
    } else {
      await this.memberRepository.save({
        conversationId,
        userId: memberId,
        role: ConversationMemberRole.MEMBER,
      });
    }

    const newMember = await this.userRepository.findOne({ where: { id: memberId } });
    await this.addSystemMessage(conversationId, user.id, `${user.fullName} added ${newMember?.fullName || 'a member'}`);
  }

  private async removeMember(conversationId: number, memberId: number, user: User) {
    const removedUser = await this.userRepository.findOne({ where: { id: memberId } });
    await this.memberRepository.update(
      { conversationId, userId: memberId },
      { isActive: false, leftAt: new Date() },
    );
    await this.addSystemMessage(conversationId, user.id, `${user.fullName} removed ${removedUser?.fullName || 'a member'}`);
  }

  private async addSystemMessage(conversationId: number, senderId: number, content: string) {
    await this.messageRepository.save({
      conversationId,
      senderId,
      content,
      messageType: MessageType.SYSTEM,
    });
  }
}
