import { Workbook } from 'exceljs';
import readFileToBuffer from './readFileToBuffer';
const readTemplate = async (
  fileUrl: string,
): Promise<{ label: string; row: number; col: number }[]> => {
  const TemplateData: Array<{
    label: string;
    row: number;
    col: number;
  }> = [];
  const buffer = await readFileToBuffer(fileUrl);
  const workbook = new Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);
  worksheet.eachRow(function (row, rowNumber) {
    const rowValues = row.values;
    Array.prototype.forEach.call(rowValues, function (cell, index) {
      // 判断cell 是否包含{{}},并提取里面的内容
      if (cell && cell.toString().includes('{{')) {
        const cellValue = cell.replace(/\{\{([^}]+)\}\}/g, '$1');
        const item = {
          label: cellValue,
          row: rowNumber,
          col: index,
        };
        TemplateData.push(item);
      }
    });
  });
  return TemplateData;
};
export default readTemplate;
