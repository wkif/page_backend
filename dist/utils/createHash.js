"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const crypto = require("crypto");
function creatFileHash(filePath) {
    if (!fs.existsSync(filePath)) {
        return {
            code: 0,
            msg: '文件不存在',
            data: null,
        };
    }
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('SHA256');
    hash.update(buffer);
    const final = hash.digest('hex');
    return {
        code: 1,
        data: final,
        msg: 'ok',
    };
}
exports.default = creatFileHash;
//# sourceMappingURL=createHash.js.map