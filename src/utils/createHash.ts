import * as fs from 'fs';
import * as crypto from 'crypto';
export default function creatFileHash(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return {
      code: 0,
      msg: '文件不存在',
      data: null,
    };
  }
  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('SHA256');
  hash.update(buffer);
  const final = hash.digest('hex');
  return {
    code: 1,
    data: final,
    msg: 'ok',
  };
}
