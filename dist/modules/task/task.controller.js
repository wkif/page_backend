"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const stream_1 = require("stream");
const task_service_1 = require("./task.service");
const user_service_1 = require("../user/user.service");
const app_service_1 = require("../../app.service");
let TaskController = class TaskController {
    constructor(taskService, userService, appService) {
        this.taskService = taskService;
        this.userService = userService;
        this.appService = appService;
    }
    async addTask(data) {
        const { userId, title, mainTitle, date, arranger, estimatedWorkingHours, estimatedStartDate, estimatedEndDate, actualWorkingHours, actualStartDate, actualEndDate, status, progress, remarks, level, } = data;
        if (!userId ||
            !title ||
            !mainTitle ||
            !date ||
            !arranger ||
            !estimatedWorkingHours ||
            !estimatedStartDate ||
            !estimatedEndDate ||
            !status ||
            !progress ||
            !level) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.taskService.addTask(userId, title, mainTitle, date, arranger, estimatedWorkingHours, estimatedStartDate, estimatedEndDate, actualWorkingHours, actualStartDate, actualEndDate, status, progress, remarks, level);
    }
    async editTask(data) {
        const { id, userId, title, mainTitle, date, arranger, estimatedWorkingHours, estimatedStartDate, estimatedEndDate, actualWorkingHours, actualStartDate, actualEndDate, status, progress, remarks, level, } = data;
        if (!id ||
            !userId ||
            !title ||
            !mainTitle ||
            !date ||
            !arranger ||
            !estimatedWorkingHours ||
            !estimatedStartDate ||
            !estimatedEndDate ||
            !status ||
            !progress ||
            !level) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        return await this.taskService.editTask(id, userId, title, mainTitle, date, arranger, estimatedWorkingHours, estimatedStartDate, estimatedEndDate, actualWorkingHours, actualStartDate, actualEndDate, status, progress, remarks, level);
    }
    async getTaskList(data) {
        const { userId, page, status, title, mainTitle, date, level } = data;
        if (!userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.taskService.getTaskList(userId, page, status, title, mainTitle, date, level);
    }
    async getTaskById(data) {
        const { id, userId } = data;
        if (!id || !userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.taskService.getTaskById(id, userId);
    }
    async deleteTask(data) {
        const { id, userId } = data;
        if (!id || !userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.taskService.deleteTask(id, userId);
    }
    async uploadFile(file, data) {
        const { userId, type } = data;
        if (!userId || !type) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: null,
            };
        }
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        return await this.userService.addTemplate(userId, file.filename, type);
    }
    async exportDaily(data, response) {
        const { userId, date } = data;
        if (!userId || !date) {
            response.send({
                code: 500,
                msg: '请完整填写信息',
                data: null,
            });
            return;
        }
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            response.send({
                code: 500,
                msg: '用户不存在',
                data: null,
            });
            return;
        }
        const defaultFileName = `[[userid]]_[[username]]_[[email]]_[[date]].xlsx`;
        const dailyTemplateName = user.dailyTemplateName
            ? user.dailyTemplateName
            : defaultFileName;
        const fileName = dailyTemplateName
            .replace('[[userid]]', user.id.toString())
            .replace('[[username]]', user.username)
            .replace('[[date]]', date)
            .replace('[[email]]', user.email);
        const res = await this.taskService.exportDaily(userId, date, fileName);
        if (res.code == 200) {
            response.send({
                code: 200,
                msg: '成功',
                data: {
                    hisId: res.data,
                },
            });
            return;
        }
        else {
            response.send({
                code: 500,
                msg: res.msg,
                data: null,
            });
            return;
        }
    }
    async sendDailyEmail(data) {
        const { userId, hisId } = data;
        if (!userId || !hisId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: null,
            };
        }
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        return await this.taskService.sendDailyEmail(userId, hisId);
    }
    async exportMonthly(data, response) {
        const { userId, startDate, endDate } = data;
        if (!userId || !startDate || !endDate) {
            response.send({
                code: 500,
                msg: '请完整填写信息',
                data: null,
            });
            return;
        }
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            response.send({
                code: 500,
                msg: '用户不存在',
                data: null,
            });
            return;
        }
        const defaultFileName = `[[userid]]_[[username]]_[[email]]_[[startDate]]_[[endDate]].xlsx`;
        const monthlyTemplateName = user.monthlyTemplateName
            ? user.monthlyTemplateName
            : defaultFileName;
        const fileName = monthlyTemplateName
            .replace('[[userid]]', user.id.toString())
            .replace('[[username]]', user.username)
            .replace('[[email]]', user.email)
            .replace('[[startDate]]', startDate)
            .replace('[[endDate]]', endDate);
        const res = await this.taskService.exportMonthly(userId, startDate, endDate, fileName);
        if (res.code == 200) {
            response.send({
                code: 200,
                msg: '成功',
                data: res.data,
            });
            return;
        }
        else {
            response.send({
                code: 500,
                msg: res.msg,
                data: null,
            });
            return;
        }
    }
    async getHistoryList(data) {
        const { userId, page, type } = data;
        if (!userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.taskService.getHistoryList(userId, page, type);
    }
    async deleteHistoryFile(data) {
        const { id, userId } = data;
        if (!id || !userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.taskService.deleteHistoryFile(id, userId);
    }
    async downloadHistoryFile(response, data) {
        const { userId, hisId } = data;
        if (!userId || !hisId) {
            response.send({
                code: 500,
                msg: '请完整填写信息',
                data: null,
            });
            return;
        }
        const res = await this.taskService.downloadHistoryFile(userId, hisId);
        if (res.code == 200) {
            const filePath = res.data.filePath;
            const buffer = fs.readFileSync(filePath);
            const stream = new stream_1.Readable();
            stream.push(buffer);
            stream.push(null);
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Length': buffer.length,
                'Content-disposition': `attachment; filename=${encodeURIComponent(res.data.fileName)}`,
            });
            stream.pipe(response);
        }
        else {
            response.send({
                code: 500,
                msg: res.msg,
                data: null,
            });
            return;
        }
    }
    async downloadTemplate(response, data) {
        const { userId, type } = data;
        if (!userId || !type) {
            response.send({
                code: 500,
                msg: '请完整填写信息',
                data: null,
            });
            return;
        }
        const filePath = await this.userService.getTemplate(userId, type);
        if (!filePath) {
            response.send({
                code: 500,
                msg: '模板不存在',
                data: null,
            });
            return;
        }
        const buffer = fs.readFileSync(filePath);
        const stream = new stream_1.Readable();
        stream.push(buffer);
        stream.push(null);
        response.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length': buffer.length,
            'Content-disposition': `attachment; filename=${encodeURIComponent(filePath)}`,
        });
        stream.pipe(response);
    }
    async getTaskByMonth(data) {
        const { userId, year, month } = data;
        if (!userId || !year || !month) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.taskService.getTaskByMonth(userId, year, month);
    }
    async getHoildayByMonth(data) {
        console.time();
        const { userId, year, month } = data;
        if (!userId || !year || !month) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        console.timeEnd();
        return await this.taskService.getHoildayByMonth(userId, year, month);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Post)('addTask'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "addTask", null);
__decorate([
    (0, common_1.Post)('editTask'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "editTask", null);
__decorate([
    (0, common_1.Post)('getTaskList'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskList", null);
__decorate([
    (0, common_1.Post)('getTaskById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Post)('deleteTask'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Post)('uploadTemplate'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter(req, file, callback) {
            if (!file.mimetype.includes('spreadsheetml')) {
                callback(new common_1.MethodNotAllowedException('类型不支持'), false);
            }
            else {
                callback(null, true);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('exportDaily'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "exportDaily", null);
__decorate([
    (0, common_1.Post)('sendDailyEmail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "sendDailyEmail", null);
__decorate([
    (0, common_1.Post)('exportMonthly'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "exportMonthly", null);
__decorate([
    (0, common_1.Post)('getHistoryList'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getHistoryList", null);
__decorate([
    (0, common_1.Post)('deleteHistoryFile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteHistoryFile", null);
__decorate([
    (0, common_1.Post)('downloadHistoryFile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "downloadHistoryFile", null);
__decorate([
    (0, common_1.Post)('downloadTemplate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "downloadTemplate", null);
__decorate([
    (0, common_1.Post)('getTaskByMonth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskByMonth", null);
__decorate([
    (0, common_1.Post)('getHoildayByMonth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getHoildayByMonth", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('task'),
    __metadata("design:paramtypes", [task_service_1.TaskService,
        user_service_1.UserService,
        app_service_1.AppService])
], TaskController);
//# sourceMappingURL=task.controller.js.map