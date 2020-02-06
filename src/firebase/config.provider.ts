import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as serviceAccount from '../../serviceAccount.json';
import { ConfigService } from '@nestjs/config';

import { SignInDto } from '../models/sign-in.dto';

/**
 * Firebase services.
 */
@Injectable()
export class FirebaseService {
  /**
   * Firebase auth services.
   */
  public auth;

  /**
   * Firebase realtime database.
   */
  public db;

  /**
   * Firebase reference for messages.
   */
  public ref;

  /**
   * Class constructor.
   * @param configService NestJS configuration services. Used for env variables.
   */
  constructor(private readonly configService: ConfigService) {
    console.log(this.configService.get('FIREBASE_DB_URL'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as string | admin.ServiceAccount),
      databaseURL: this.configService.get('FIREBASE_DB_URL')
    });
    
    this.auth = admin.auth();
    this.db = admin.database();
    this.ref = this.db.ref('messages');

    this.ref.once('value', snapshot => {
      console.log('val: ', snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // var usersRef = this.ref.child("users");
    // usersRef.set({
    //   alanisawesome: {
    //     date_of_birth: "June 23, 1912",
    //     full_name: "Alan Turing"
    //   },
    //   gracehop: {
    //     date_of_birth: "December 9, 1906",
    //     full_name: "Grace Hopper"
    //   }
    // });

    // this.sendMessage('n6pKm5W783Vjur22aYokkfwYstR2', 'Ww0PUEqnCHcbpSLsKm7sydP0VRE3', 'testing again.');

    // this.getOrCreateChat('n6pKm5W783Vjur22aYokkfwYstR2', 'Ww0PUEqnCHcbpSLsKm7sydP0VRE3');
  
    // this.db.ref(`members/chat_Ww0PUEqnCHcbpSLsKm7sydP0VRE3_n6pKm5W783Vjur22aYokkfwYstR2/n6pKm5W783Vjur22aYokkfwYstR2`).once('value')
    // .then(data => {
    //   console.log('data:::::', data.val());
    // });

    //  this.getChatMeta('Ww0PUEqnCHcbpSLsKm7sydP0VRE3');
  }

  /**
   * Creates users in firebase rtdb.
   * @param signInDto Sign in data.
   */
  public async createUser(signInDto: SignInDto): Promise<any> {
    return await this.auth.createUser(signInDto);
  }

  /**
   * Verifies tokern and returns user info.
   * @param token User token
   */
  public async verifyUser(token) {
    return await this.auth.verifyIdToken(token);
  }

  /**
   * Returns a chat id.
   * @param uid1 User ID
   * @param uid2 User ID
   */
  private chatId(uid1, uid2) {
    let chatIdComparison = uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
    return `chat_${chatIdComparison}`;
  }

  /**
   * Sends messages for chat.
   * @param senderUid Sender uid
   * @param recipientUid Recipient uid
   * @param message Message being sent.
   */
  public sendMessage(senderUid, recipientUid, message) {
    let date: Date = new Date();
    let timestamp: number = date.getTime();

    this.db.ref(`messages/${this.chatId(senderUid, recipientUid)}`).push({
      sender: senderUid,
      recipient: recipientUid,
      timestamp,
      message
    }).then(data => {
      console.log('data: ', data);
    }, err => {
      console.log('err:', err);
    });
  }

  /**
   * Sets members for a one on one chat.
   * @param uid1 User UID
   * @param uid2 User UID
   */
  private setChat(uid1, uid2): Promise<any> {
    let data = {
      [uid1]: true,
      [uid2]: true
    };

    return new Promise((resolve, reject) => {
      this.db.ref(`members/${this.chatId(uid1, uid2)}`).set(data, error => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Add chat id to user info.
   * @param uid User uid
   * @param chatId Chat Id
   */
  private async setChatToUsers(uid, chatId): Promise<void> {
    await this.db.ref(`users/${uid}/chats/${chatId}`).set(true, err => {
      console.log('err!!!', err);
    });
  }

  /**
   * Returns user info
   * @param userUid User UID
   */
  public async getUserInfo(userUid) {
    let info = await this.db.ref(`users/${userUid}/info`).once('value');
    return info.val();
  };

  /**
   * Gets chat rooms user belongs to
   * @param userId User uid
   */
  public async getUserChats(userId) {
    let chats = await this.db.ref(`users/${userId}`).once('value');
    let keys = Object.keys(chats.val());
    let i = 0;
    let l = keys.length;
  }

  /**
   * Gets or creates new chat room.
   * @param senderUid Sender UID
   * @param recipientUid recipient UID
   */
  public async getOrCreateChat(senderUid, recipientUid) {
    let chatId = this.chatId(senderUid, recipientUid);
    let result = await this.db.ref(`members/${chatId}`).once('value');

    if (!result.val()) {
      result = await this.setChat(senderUid, recipientUid);
      await this.setChatToUsers(senderUid, chatId);
      await this.setChatToUsers(recipientUid, chatId);

      return result;
    }

    return result;
  }

  /**
   * Saves / creates user in rtdb
   * @param userUid User UID
   * @param data User info.
   */
  public async saveUser(userUid, data) {
    await this.db.ref(`users/${userUid}/info`).set(data);
  }
}
