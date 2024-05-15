import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entity/link.entity';
import { Category } from './entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Link, Category])],
  controllers: [LinksController],
  providers: [LinksService, UserService],
})
export class LinksModule {}
