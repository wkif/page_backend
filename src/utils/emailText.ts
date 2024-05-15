import * as xlsx from 'xlsx';

const createEmailText = (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const htmlTable = xlsx.utils.sheet_to_html(worksheet);
  return htmlTable;
};
export default createEmailText;
