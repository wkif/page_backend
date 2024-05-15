import { Workbook } from 'exceljs';

const writeTemplate = (
  filePath: string,
  tasksData: any[],
  templateData: { label: string; row: number; col: number }[],
) => {
  return new Promise((resolve, reject) => {
    const workbook = new Workbook();
    workbook.xlsx
      .readFile(filePath)
      .then(function () {
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
        workbook.xlsx
          .writeFile(filePath)
          .then(function () {
            resolve(true);
          })
          .catch(function (error) {
            reject(error);
          });
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
export default writeTemplate;
