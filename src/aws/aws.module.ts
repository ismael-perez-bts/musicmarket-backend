import { Module, Global } from '@nestjs/common';
import { AWSService } from './aws.provider';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  providers: [ AWSService ],
  imports: [ ConfigModule.forRoot() ],
  exports: [ AWSService ]
})
export class AWSModule {
  constructor() {}
}