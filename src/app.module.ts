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
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/items', method: RequestMethod.POST });
  }
}
