"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = require("exceljs");
const readTemplate = async (filePath) => {
    const TemplateData = [];
    const workbook = new exceljs_1.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    worksheet.eachRow(function (row, rowNumber) {
        const rowValues = row.values;
        Array.prototype.forEach.call(rowValues, function (cell, index) {
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
exports.default = readTemplate;
//# sourceMappingURL=readTemplate.js.map