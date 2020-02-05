import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './config.provider';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ ConfigModule.forRoot() ],
  providers: [ FirebaseService ],
  exports: [ FirebaseService ]
})
export class FirebaseModule {
  constructor() {}
}