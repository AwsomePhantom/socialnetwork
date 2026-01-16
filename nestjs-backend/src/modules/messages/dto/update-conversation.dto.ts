import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export enum ConversationAction {
  MUTE = 'mute',
  RENAME = 'rename',
  ADD_MEMBER = 'add_member',
  REMOVE_MEMBER = 'remove_member',
  MAKE_ADMIN = 'make_admin',
}

export class UpdateConversationDto {
  @IsEnum(ConversationAction)
  action: ConversationAction;

  @IsOptional()
  @IsBoolean()
  muted?: boolean;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  memberId?: number;
}
