import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from './database/config.module';
import { FirebaseModule } from './firebase/config.module';
import { AWSModule } from './aws/aws.module';
import { SignInModule } from './sign-in/sign-in.module';
import { ItemsModule } from './items/items.module';
import { LocationsModule } from './mexican-locations/locations.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';;

import { AuthMiddleware } from './middleware/auth.middleware';


@Module({
  imports: [
    DataBaseModule,
    FirebaseModule,
    SignInModule,
    ItemsModule,
    AWSModule,
    LocationsModule,
    CategoriesModule,
    UsersModule,
    ChatsModule,
    ConfigModule.forRoot({
      envFilePath: '.local.env',
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/items', method: RequestMethod.POST },
        { path: 'api/users/self', method: RequestMethod.GET },
        { path: 'api/users/self', method: RequestMethod.POST },
        { path: 'api/users/self', method: RequestMethod.PUT },
        { path: 'api/chats/*', method: RequestMethod.GET }
      );
  }
}
