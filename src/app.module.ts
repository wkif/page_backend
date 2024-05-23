import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

import { jwtAuthGuard } from './modules/auth/jwt-auth.grard';

import { APP_GUARD } from '@nestjs/core';
import { LinksModule } from './modules/links/links.module';
import { TaskModule } from './modules/task/task.module';
import { HttpModule } from '@nestjs/axios';
import { OssModule } from './modules/oss/oss.module';
import LogsMiddleware from './logger/logger.middleware';

import customConfig from 'src/config/index';
const { database, oss } = customConfig()();
console.log('database', database);
console.log('oss', oss);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [customConfig],
    }),
    TypeOrmModule.forRoot(database),
    UserModule,
    AuthModule,
    LinksModule,
    TaskModule,
    HttpModule,
    OssModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: jwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
