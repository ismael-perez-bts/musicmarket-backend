import { IsEmail, IsNotEmpty } from 'class-validator';

export interface Conversation {
  id: string;
  members: {
    <T>(): boolean;
    <T>(): boolean;
  }
}

export interface Message {
  conversationId: string;
  senderId: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export class PostMessageDto {

  @IsNotEmpty()
  recipientId: string;

  @IsNotEmpty()
  message: string;
}
