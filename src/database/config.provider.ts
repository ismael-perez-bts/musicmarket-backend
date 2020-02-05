import { Client } from 'pg';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Database service.
 */
@Injectable()
export class DatabaseService {
  public client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      database: this.configService.get('DATABASE'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
    });

    this.client.connect()
    .then(() => {
      console.log('Database is connected');
    })
    .catch((e) => {
      console.log('Error: ', e);
    });
  }
}