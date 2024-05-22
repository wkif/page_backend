import { Workbook } from 'exceljs';
import readFileToBuffer from './readFileToBuffer';
const writeTemplate = async (
  url: string,
  tasksData: any[],
  templateData: { label: string; row: number; col: number }[],
) => {
  const workbook = new Workbook();
  const buffer = await readFileToBuffer(url);
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);
  const startRow = templateData[0].row;
  const startCol = templateData[0].col;
  tasksData.forEach((item, index) => {
    const row = worksheet.getRow(startRow + index);
    templateData.forEach((data) => {
      row.getCell(data.col + startCol - 1).value = item[data.label];
      row.getCell(data.col + startCol - 1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
    row.commit();
  });
  const saveBuffer = await workbook.xlsx.writeBuffer();
  return saveBuffer;
  // return new Promise(async (resolve, reject) => {

  //   // workbook.xlsx
  //   //   .readFile(filePath)
  //   //   .then(function () {
  //   //     const worksheet = workbook.getWorksheet(1);
  //   //     const startRow = templateData[0].row;
  //   //     const startCol = templateData[0].col;
  //   //     tasksData.forEach((item, index) => {
  //   //       const row = worksheet.getRow(startRow + index);
  //   //       templateData.forEach((data) => {
  //   //         row.getCell(data.col + startCol - 1).value = item[data.label];
  //   //         row.getCell(data.col + startCol - 1).alignment = {
  //   //           vertical: 'middle',
  //   //           horizontal: 'center',
  //   //         };
  //   //       });
  //   //       row.commit();
  //   //     });
  //   //     workbook.xlsx
  //   //       .writeFile(filePath)
  //   //       .then(function () {
  //   //         resolve(true);
  //   //       })
  //   //       .catch(function (error) {
  //   //         reject(error);
  //   //       });
  //   //   })
  //   //   .catch(function (error) {
  //   //     reject(error);
  //   //   });
  // });
};
export default writeTemplate;
