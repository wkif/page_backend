import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Link } from '../links/entity/link.entity';
import { Task } from '../task/entity/task.entity';
import { TaskHistory } from '../task/entity/taskHistory';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Link, Task, TaskHistory]),
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
