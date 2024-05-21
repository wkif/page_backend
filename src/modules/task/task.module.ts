import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

import config from 'src/config';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entity/task.entity';
import { TaskHistory } from './entity/taskHistory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { AppService } from 'src/app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, TaskHistory]),
    MulterModule.register({
      storage: diskStorage({
        destination: config().uploadsPath,
        filename: (req, file, callback) => {
          const fileName = `${req.body.userId}__${req.body.type == 1 ? 'daily' : 'monthly'}__${
            new Date().getTime() + path.extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
    HttpModule,
  ],
  providers: [TaskService, UserService, AppService],
  controllers: [TaskController],
})
export class TaskModule {}
