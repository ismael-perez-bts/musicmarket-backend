import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/config.provider';
import { DatabaseService } from '../database/config.provider';
import * as userQueries from '../database/queries/users.queries';

@Injectable()
export class ChatsService {

  constructor(private readonly firebase: FirebaseService, private readonly db: DatabaseService) {}

  public async postMessage(senderUid, recipientUid, message) {
    await this.firebase.sendMessage(senderUid, recipientUid, message);
  }

  public async getChatOrCreate(userUid, recipientUid) {
    let results = await this.firebase.getOrCreateChat(userUid, recipientUid);

    return results;
  }
}