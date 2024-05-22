import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import customConfig from 'src/config/index';
const { oss } = customConfig()();
@Injectable()
export class OssService {
  private client: any;
  public constructor() {
    this.client = new OSS({
      accessKeyId: oss.accessKeyId,
      accessKeySecret: oss.accessKeySecret,
      region: oss.region,
      bucket: oss.bucket,
    });
  }
  /**
   * 上传文件
   * @param localPath
   * @param ossPath
   * @param size
   */
  public async uploadFile(
    localPath: string,
    ossPath: string,
    size: number,
  ): Promise<string> {
    if (size > 5 * 1024 * 1024) {
      // 设置MB
      return await this.resumeUpload(ossPath, localPath);
    } else {
      return await this.upload(ossPath, localPath);
    }
  }
  // oss put上传文件
  private async upload(ossPath: string, localPath: string): Promise<string> {
    let res;
    try {
      res = await this.client.put(ossPath, localPath);
      // 将文件设置为公共可读
      await this.client.putACL(ossPath, 'public-read');
    } catch (error) {
      console.log(error);
    }
    return res.url;
  }
  // oss 断点上传
  private async resumeUpload(ossPath: string, localPath: string) {
    let checkpoint: any = 0;
    let bRet = '';
    for (let i = 0; i < 3; i++) {
      try {
        const result = this.client.get().multipartUpload(ossPath, localPath, {
          checkpoint,
          async progress(percent: number, cpt: any) {
            checkpoint = cpt;
          },
        });
        // 将文件设置为公共可读
        await this.client.putACL(ossPath, 'public-read');
        bRet = result.url;
        break;
      } catch (error) {
        // console.log(error)
      }
    }
    console.log('resumeUpload:::::', bRet);
    return bRet;
  }
  public async putStream(stream: any, path: string) {
    const result = await this.client.putStream(path, stream);
    if (result.res.status == 200) {
      const url = this.getFileSignatureUrl(path);
      return url;
    } else {
      console.log('error', result);
      return '';
    }
  }
  /**
   * 删除一个文件
   */
  public async deleteOne(filepath: string) {
    if (filepath == null) {
      return;
    }
    try {
      await this.client.delete(filepath);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 删除多个文件
   * @param filepathArr
   */
  public async deleteMulti(filepathArr: string[]): Promise<void> {
    try {
      const result = this.client.deleteMulti(filepathArr, { quiet: true });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * 获取文件的url
   * @param filePath
   */
  public async getFileSignatureUrl(filePath: string): Promise<string> {
    if (filePath == null) {
      console.log('get file signature failed: file name can not be empty');
      return null;
    }
    let result = '';
    try {
      result = this.client.signatureUrl(filePath, { expires: 36000 });
    } catch (err) {
      console.log(err);
    }

    return result;
  }
  // 判断文件是否存在
  public async existObject(ossPath: string): Promise<boolean> {
    try {
      await this.client.head(ossPath);
      return true;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        return false;
      }
    }
  }
}
