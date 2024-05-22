import * as crypto from 'crypto';
import readFileToBuffer from './readFileToBuffer';
export default async function creatFileHash(url: string) {
  const buffer = await readFileToBuffer(url);
  const hash = crypto.createHash('SHA256');
  hash.update(buffer);
  const final = hash.digest('hex');
  return {
    code: 1,
    data: final,
    msg: 'ok',
  };
}
