import * as AWS from 'aws-sdk';
import * as btoa from 'btoa';
import { Injectable } from '@nestjs/common';
import { S3Image } from '../models/s3-models';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AWSService {

  public s3;

  private myBucket: string;

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

  private makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


  private keyRandomizer(userId, key) {
    let type = key.split('.').pop();
    return `${userId}/${userId}-${this.makeId(20)}.${type.toLowerCase()}`;
  }

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
}