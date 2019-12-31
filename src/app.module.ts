import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from './database/config.module';
import { FirebaseModule } from './firebase/config.module';
import { SignInModule } from './sign-in/sign-in.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [DataBaseModule, FirebaseModule, SignInModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
