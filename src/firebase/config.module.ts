import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './config.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ FirebaseService, ConfigService ],
  exports: [ FirebaseService ]
})
export class FirebaseModule {
  constructor() {}
}