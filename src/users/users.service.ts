import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DatabaseService } from '../database/config.provider';
import * as userQueries from '../database/queries/users.queries';
import * as itemQueries from '../database/queries/items.queries';
import { AWSService } from '../aws/aws.provider';
import { S3Image } from '../models/s3-models';

/**
 * Service to get user information and edit profile.
 */
@Injectable()
export class UsersService {

  constructor(private readonly dbService: DatabaseService, private readonly aws: AWSService) {}

  async getUser(id: string) {
    let results = await this.dbService.client.query(userQueries.getUserById, [id]);
 
    if (results.rows.length) {
      return results.rows[0];
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async getSelf(uid: string) {
    let results = await this.dbService.client.query(userQueries.getUserByUid, [uid]);

    if (results.rows.length) {
      return results.rows[0];
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async putProfile(data, user, imageFile?) {
    let imageData: S3Image;
    let queryData: Array<string>;
    let query: string;
    
    if (imageFile) {
      query = userQueries.updateProfileWithImage;
      imageData = await this.aws.uploadProfileImage(imageFile.buffer, user.uid, imageFile.originalname);
      queryData = [
        data.name,
        imageData.Location,
        user.uid
      ];
    } else {
      query = userQueries.updateProfileName;
      queryData = [
        data.name,
        user.uid
      ];
    }


    if ((!user || !user.uid) || !data.name || data.name.length < 2) {
      throw new HttpException('Conditions failed', HttpStatus.PRECONDITION_FAILED);
    }

    let results = await this.dbService.client.query(query, queryData);

    if (results.rowCount > 0) {
      return { ...user, ...results.rows[0] };
    } else {
      throw new HttpException('DB Problem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserItems(uid) {
    let results = await this.dbService.client.query(itemQueries.itemsByUserUid, [uid]);
    return results.rows;
  }
}
