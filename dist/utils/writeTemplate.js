"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = require("exceljs");
const writeTemplate = (filePath, tasksData, templateData) => {
    return new Promise((resolve, reject) => {
        const workbook = new exceljs_1.Workbook();
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
exports.default = writeTemplate;
//# sourceMappingURL=writeTemplate.js.map