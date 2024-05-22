import axios from 'axios';
const readFileToBuffer = async (fileUrl: string): Promise<Buffer> => {
  try {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
};
export default readFileToBuffer;
