import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { PostMessageDto } from '../models/chats.model';
import { ExtendedRequest } from '../models/extended-request.dto';
import { ChatsService } from './chats.service';
import { IdDto } from '../models/user.model';

@Controller('api/chats')
export class ChatsController {

  constructor(private readonly chatsService:  ChatsService) {}

  @Post()
  async postMessage(@Body() messageData: PostMessageDto, @Req() req: ExtendedRequest) {
    try {
      let user = req.user;
      await this.chatsService.postMessage(user.uid, messageData.recipientId, messageData.message);
    } catch (e) {
      throw e;
    }
  }

  @Get('open/:recipientUid')
  async getMessage(@Param() params: IdDto, @Req() req) {
    try {
      let user = req.user;
      let recipientUid = params.recipientUid;

      let results = await this.chatsService.getChatOrCreate(user.uid, recipientUid);
      return { message: 'success', data: results };
    } catch (e) {
      throw e;
    }
  }
}