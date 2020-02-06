import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './config.provider';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ DatabaseService, ConfigService ],
  exports: [ DatabaseService ]
})
export class DataBaseModule {}