import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './config.provider';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ ConfigModule.forRoot() ],
  providers: [ DatabaseService ],
  exports: [ DatabaseService ]
})
export class DataBaseModule {}