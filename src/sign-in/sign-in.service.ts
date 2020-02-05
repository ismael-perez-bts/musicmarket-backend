import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/config.provider';
import { DatabaseService } from '../database/config.provider';
import { SignInDto } from '../models/sign-in.dto';
import * as userQueries from '../database/queries/users.queries';

@Injectable()
export class SignInService {

  constructor(private firebaseService: FirebaseService, private databaseService: DatabaseService) {

  }

  public async signUp(signInDto: SignInDto): Promise<void> {
    try {
      const user = await this.firebaseService.auth.createUser(signInDto);
      return user;
    } catch (e) {

      console.log(e);
    }
    
  }

  public async signInOrCreate(idToken: string): Promise<any> {
    try {
      let user = await this.firebaseService.auth.verifyIdToken(idToken);
      let values = userQueries.inserUserKeys.map(key => {
        return user[key] || '';
      });

      let results = await this.databaseService.client.query(userQueries.getUserByUid, [user.uid]);


      if (results.rows.length) {
        let data = { ...user, ...results.rows[0] };
        return data;
      }

      let insertResults = await this.databaseService.client.query(userQueries.insertUser, values);

      await this.firebaseService.saveUser(insertResults.rows[0].uid, insertResults.rows[0]);

      return { ...user, ...insertResults.rows[0] }; 
    } catch(e) {

      console.log(e);
    }
  }
}
