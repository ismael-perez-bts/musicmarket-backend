import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './config.provider';

@Global()
@Module({
  providers: [ FirebaseService ],
  exports: [ FirebaseService ]
})
export class FirebaseModule {
  constructor() {}
}