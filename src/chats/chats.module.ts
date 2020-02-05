import { Module, HttpModule } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service'

@Module({
  imports: [HttpModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
