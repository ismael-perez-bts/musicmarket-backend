import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FirebaseService } from '../firebase/config.provider';
import { ExtendedRequest } from '../models/extended-request.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private firebase: FirebaseService) {}
  async use(req: ExtendedRequest, res: Response, next: Function) {
    try {
      console.log('path: ', req.path);
      if (req.method === 'GET' && (req.path !== '/api/users/self' && !req.path.match(/chats/gi))) {
        next();
        return;
      }

      const user = await this.firebase.verifyUser(req.headers.authorization);
  
      console.log('USER: ', user);
      if (user) {
        req.user = user;
        next();
        return;
      }

      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    } catch (e) {
      console.log('Error: ', e);
      next();
    }
  }
}
