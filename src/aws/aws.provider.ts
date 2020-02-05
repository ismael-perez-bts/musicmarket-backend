import * as AWS from 'aws-sdk';
import * as btoa from 'btoa';
import { Injectable } from '@nestjs/common';
import { S3Image } from '../models/s3-models';
import { ConfigService } from '@nestjs/config';

/**
 * AWS service provider.
 */
@Injectable()
export class AWSService {
  /**
   * AWS S3 instance.
   */
  public s3;

  /**
   * S3 bucket name.
   */
  private myBucket: string;

  /**
   * Class constructor
   * @param configService NestJS configuration services.
   */
  constructor(private readonly configService: ConfigService) {
    AWS.config.update({ accessKeyId: this.configService.get('ACCESS_KEY_ID'), secretAccessKey: this.configService.get('SECRET_ACCESS_KEY') });
    this.myBucket = this.configService.get('BUCKET');
    this.s3 = new AWS.S3();
    this.s3.listBuckets((err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Buckets);
      }
    });
  }

  /**
   * Makes ID for item images.
   * @param length 
   */
  private makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Random string maker.
   * @param userId User ID
   * @param key image key
   */
  private keyRandomizer(userId, key) {
    let type = key.split('.').pop();
    return `${userId}/${userId}-${this.makeId(20)}.${type.toLowerCase()}`;
  }

  /**
   * Random string maker for profiles.
   * @param userId User ID
   * @param key Image key.
   */
  private keyRandomizerProfile(userId, key) {
    let type = key.split('.').pop();
    return `${userId}/profile-${this.makeId(5)}.${type.toLowerCase()}`;
  }

  /**
   * Uploads item image.
   * @param stream Image string
   * @param userId User ID
   * @param key Image key
   */
  public uploadItemImage(stream, userId, key): Promise<S3Image> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.myBucket,
        Key: this.keyRandomizer(userId, key),
        Body: stream,
        ACL:'public-read',
        ContentType: 'image/jpeg'
      };
      this.s3.upload(params, function(err, data) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve(data);
      });
    });
  }

  /**
   * Uploads image profile.
   * @param stream Image stream.
   * @param userId User ID
   * @param key Image key
   */
  public uploadProfileImage(stream, userId, key): Promise<S3Image> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.myBucket,
        Key: this.keyRandomizerProfile(userId, key),
        Body: stream,
        ACL:'public-read',
        ContentType: 'image/jpeg'
      };
      this.s3.upload(params, function(err, data) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve(data);
      });
    });
  }
}