import { Module } from '@nestjs/common';
import { SignInController } from './sign-in.controller';
import { SignInService } from './sign-in.service';
// import { DataBaseModule } from '../database/config.module';
// import { FirebaseModule } from '../firebase/config.module';
// import { FirebaseService } from 'src/firebase/config.provider';

@Module({
  imports: [],
  controllers: [SignInController],
  providers: [SignInService],
})
export class SignInModule {}
