import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

import { jwtAuthGuard } from './modules/auth/jwt-auth.grard';

// import config from './common/config';
import { APP_GUARD } from '@nestjs/core';
import { LinksModule } from './modules/links/links.module';
import { TaskModule } from './modules/task/task.module';
import { HttpModule } from '@nestjs/axios';
import { OssModule } from './modules/oss/oss.module';
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
    // MulterModule.register({
    //   storage: diskStorage({
    //     // 指定文件存储目录
    //     destination: path.join(__dirname, '../uploads'),
    //     // 通过时间戳来重命名上传的文件名
    //     filename: (_, file, callback) => {
    //       const fileName = `${
    //         new Date().getTime() + path.extname(file.originalname)
    //       }`;
    //       return callback(null, fileName);
    //     },
    //   }),
    // }),
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
export class AppModule {}
