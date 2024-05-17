"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.default = () => ({
    port: process.env.MYSQL_PORT || 5000,
    uploadsPath: path.resolve(__dirname, '../../uploads/template'),
    cachePath: path.resolve(__dirname, '../../cache'),
    api_key: '38b6644a00baf0403819b341dca388155b60',
});
//# sourceMappingURL=config.js.map