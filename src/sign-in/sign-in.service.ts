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
      // 
      console.log(user);

      return user;
    } catch (e) {

      console.log(e);
    }
    
  }

  public async signInOrCreate(idToken: string): Promise<any> {
    try {
      let user = await this.firebaseService.auth.verifyIdToken(idToken);
      console.log(user);
      let values = userQueries.inserUserKeys.map(key => {
        return user[key] || '';
      });

      await this.databaseService.client.query(userQueries.insertUser, values);

      return user;
      
    } catch(e) {

      console.log(e);
    }
  }
}
