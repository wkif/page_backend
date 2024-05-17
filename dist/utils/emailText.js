"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx = require("xlsx");
const createEmailText = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const htmlTable = xlsx.utils.sheet_to_html(worksheet);
    return htmlTable;
};
exports.default = createEmailText;
//# sourceMappingURL=emailText.js.map