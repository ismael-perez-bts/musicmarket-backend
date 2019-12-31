import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as serviceAccount from '../../serviceAccount.json';

import { SignInDto } from '../models/sign-in.dto';

@Injectable()
export class FirebaseService {
  public app;
  public admin;
  public auth;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as string | admin.ServiceAccount),
      databaseURL: "https://libro-solfeo.firebaseio.com"
    });
    
    this.auth = admin.auth();
  }

  public async createUser(signInDto: SignInDto): Promise<any> {
    return await this.auth.createUser(signInDto);
  }

  public async verifyUser(token) {
    return await this.auth.verifyUser(token);
  }
}