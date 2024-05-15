import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // 上传文件
  async uploadFile(file: Express.Multer.File) {
    // const url = process.env.HOST + '/uploads/' + file.filename
    return {
      code: 1,
      name: file.filename,
    };
  }
  getXlsxBuffer(path: string): Buffer {
    return fs.readFileSync(path);
  }
}
