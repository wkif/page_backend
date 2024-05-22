import { Module } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [OssController],
  providers: [OssService, UserService],
})
export class OssModule {}
