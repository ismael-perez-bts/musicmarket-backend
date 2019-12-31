import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './config.provider';

@Global()
@Module({
  providers: [ DatabaseService ],
  exports: [ DatabaseService ]
})
export class DataBaseModule {}