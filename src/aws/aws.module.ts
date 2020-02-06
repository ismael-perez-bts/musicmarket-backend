import { Module, Global } from '@nestjs/common';
import { AWSService } from './aws.provider';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ AWSService, ConfigService ],
  exports: [ AWSService ]
})
export class AWSModule {
  constructor() {}
}