import { Readable } from 'stream';

function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {}; // 覆盖 _read 方法，以防止读取流时触发错误
  readable.push(buffer);
  readable.push(null);
  return readable;
}
export default bufferToStream;
