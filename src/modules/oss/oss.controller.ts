import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import bufferToStream from 'src/utils/bufferToStream';

@Controller('oss')
export class OssController {
  constructor(
    private readonly ossService: OssService,
    private readonly userService: UserService,
    @InjectRepository(User) private user: Repository<User>,
  ) {}
  @Post('uploadTemplate')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { userId: number; type: number },
  ) {
    const { userId, type } = data;
    if (!userId || !type) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: null,
      };
    }
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    const fileName = `${userId}__${type == 1 ? 'daily' : 'monthly'}__${
      new Date().getTime() + '_' + file.originalname
    }`;

    if (type == 1) {
      if (user.dailyTemplate) {
        await this.ossService.deleteOne(
          'uploads/' + user.id.toString() + '/' + user.dailyTemplate,
        );
      }
      user.dailyTemplate = fileName;
    }
    if (type == 2) {
      if (user.monthlyTemplate) {
        await this.ossService.deleteOne(
          'uploads/' + user.id.toString() + '/' + user.monthlyTemplate,
        );
      }
      user.monthlyTemplate = fileName;
    }
    await this.user.save(user);
    const path = 'uploads/' + user.id.toString() + '/' + fileName;
    const streams = bufferToStream(file.buffer);
    const url = await this.ossService.putStream(streams, path);
    if (url) {
      return {
        code: 200,
        msg: 'ok',
        data: {
          url: url,
        },
      };
    }
  }

  @Post('downloadTemplate')
  async downloadTemplate(@Body() data: { userId: number; type: number }) {
    const { userId, type } = data;
    if (!userId || !type) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: null,
      };
    }
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    if (type == 1) {
      const fileName = user.dailyTemplate;
      const path = 'uploads/' + user.id.toString() + '/' + fileName;
      const isExist = await this.ossService.existObject(path);
      if (!isExist) {
        return {
          code: 500,
          msg: '文件不存在',
          data: null,
        };
      }
      const url = await this.ossService.getFileSignatureUrl(path);
      if (url) {
        return {
          code: 200,
          msg: 'ok',
          data: {
            url: url,
            name: fileName,
          },
        };
      } else {
        return {
          code: 500,
          msg: '文件不存在',
          data: null,
        };
      }
    }
    if (type == 2) {
      const fileName = user.monthlyTemplate;
      const path = 'uploads/' + user.id.toString() + '/' + fileName;
      const isExist = await this.ossService.existObject(path);
      if (!isExist) {
        return {
          code: 500,
          msg: '文件不存在',
          data: null,
        };
      }
      const url = await this.ossService.getFileSignatureUrl(path);
      if (url) {
        return {
          code: 200,
          msg: 'ok',
          data: {
            url: url,
            name: fileName,
          },
        };
      } else {
        return {
          code: 500,
          msg: '文件不存在',
          data: null,
        };
      }
    }
  }
}
