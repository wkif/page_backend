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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const task_entity_1 = require("./entity/task.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../user/user.service");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const config_1 = require("../../config");
const readTemplate_1 = require("../../utils/readTemplate");
const writeTemplate_1 = require("../../utils/writeTemplate");
const emailText_1 = require("../../utils/emailText");
const taskHistory_1 = require("./entity/taskHistory");
const createHash_1 = require("../../utils/createHash");
const date_fns_1 = require("date-fns");
const axios_1 = require("@nestjs/axios");
let TaskService = class TaskService {
    constructor(task, taskHistory, userService, httpService) {
        this.task = task;
        this.taskHistory = taskHistory;
        this.userService = userService;
        this.httpService = httpService;
    }
    async getTaskById(id, userId) {
        const task = await this.task.findOne({
            where: {
                id: id,
                user: { id: userId },
            },
        });
        return {
            code: 200,
            msg: 'ok',
            data: task,
        };
    }
    async addTask(userId, title, mainTitle, date, arranger, estimatedWorkingHours, estimatedStartDate, estimatedEndDate, actualWorkingHours, actualStartDate, actualEndDate, status, progress, remarks, level) {
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        const task = new task_entity_1.Task();
        task.user = user;
        task.title = title;
        task.mainTitle = mainTitle;
        task.date = date;
        task.arranger = arranger;
        task.estimatedWorkingHours = estimatedWorkingHours;
        task.estimatedStartDate = estimatedStartDate;
        task.estimatedEndDate = estimatedEndDate;
        task.actualWorkingHours = actualWorkingHours;
        task.actualStartDate = actualStartDate;
        task.actualEndDate = actualEndDate;
        task.status = status;
        task.progress = progress;
        task.remarks = remarks;
        task.level = level;
        await this.task.save(task);
        return {
            code: 200,
            msg: 'ok',
            data: {},
        };
    }
    async editTask(id, userId, title, mainTitle, date, arranger, estimatedWorkingHours, estimatedStartDate, estimatedEndDate, actualWorkingHours, actualStartDate, actualEndDate, status, progress, remarks, level) {
        const task = await this.task.findOne({
            where: {
                id: id,
                user: { id: userId },
            },
        });
        if (!task) {
            return {
                code: 500,
                msg: '任务不存在',
                data: null,
            };
        }
        task.title = title;
        task.mainTitle = mainTitle;
        task.date = date;
        task.arranger = arranger;
        task.estimatedWorkingHours = estimatedWorkingHours;
        task.estimatedStartDate = estimatedStartDate;
        task.estimatedEndDate = estimatedEndDate;
        task.actualWorkingHours = actualWorkingHours;
        task.actualStartDate = actualStartDate;
        task.actualEndDate = actualEndDate;
        task.status = status;
        task.progress = progress;
        task.remarks = remarks;
        task.level = level;
        await this.task.save(task);
        return {
            code: 200,
            msg: 'ok',
            data: {},
        };
    }
    async getTaskList(userId, page, status, title, mainTitle, date, level) {
        const where = {
            user: { id: userId },
            title: (0, typeorm_2.Like)(`%${title}%`),
            mainTitle: (0, typeorm_2.Like)(`%${mainTitle}%`),
            status: (0, typeorm_2.Like)(`%${status}%`),
            date: date,
            level: level,
        };
        if (!title) {
            delete where.title;
        }
        if (!mainTitle) {
            delete where.mainTitle;
        }
        if (!status) {
            delete where.status;
        }
        if (!date) {
            delete where.date;
        }
        const tasks = await this.task.find({
            where: where,
            skip: (page - 1) * 10,
            take: 10,
            order: { id: 'DESC' },
        });
        const total = await this.task.count({
            where,
        });
        return {
            code: 200,
            msg: 'ok',
            data: {
                tasks,
                total,
            },
        };
    }
    async deleteTask(id, userId) {
        const task = await this.task.findOne({
            where: {
                id: id,
                user: { id: userId },
            },
        });
        if (!task) {
            return {
                code: 500,
                msg: '任务不存在',
                data: null,
            };
        }
        await this.task.remove(task);
        return {
            code: 200,
            msg: 'ok',
            data: {},
        };
    }
    async exportDaily(userId, date, fileName) {
        const user = await this.userService.getUserByid(userId);
        if (!user.dailyTemplate) {
            return {
                code: 500,
                msg: '请先设置日报模板',
                data: null,
            };
        }
        const filePath = path.resolve((0, config_1.default)().uploadsPath, user.dailyTemplate);
        if (!fs.existsSync(filePath)) {
            return {
                code: 500,
                msg: '日报模板文件丢失，请重新上传',
                data: null,
            };
        }
        const templateData = await (0, readTemplate_1.default)(filePath);
        if (!fs.existsSync((0, config_1.default)().cachePath)) {
            fs.mkdirSync((0, config_1.default)().cachePath);
        }
        const cachePath = path.resolve((0, config_1.default)().cachePath, fileName);
        fs.copyFile(filePath, cachePath, (err) => {
            if (err) {
                return {
                    code: 500,
                    msg: '日报模板文件丢失，请重新上传',
                    data: null,
                };
            }
        });
        const tasks = await this.task.find({
            where: {
                user: {
                    id: userId,
                },
                date: date,
            },
        });
        tasks.forEach((item, index) => {
            item['username'] = user.username;
            item['fullTitle'] = item['mainTitle'] + '-' + item['title'];
            item['no'] = index + 1;
        });
        if (!tasks || tasks.length === 0) {
            return {
                code: 500,
                msg: '数据为空',
                data: null,
            };
        }
        const res = await (0, writeTemplate_1.default)(cachePath, tasks, templateData);
        if (res) {
            const his = await this.addTaskReportHistory(userId, fileName, 1, false, date);
            return {
                code: 200,
                msg: 'ok',
                data: his.data,
            };
        }
        else {
            return {
                code: 500,
                msg: '日报生成失败',
                data: null,
            };
        }
    }
    async sendDailyEmail(userId, hisId) {
        const history = await this.taskHistory.findOne({
            where: {
                id: hisId,
                user: {
                    id: userId,
                },
            },
        });
        if (!history) {
            return {
                code: 500,
                msg: '无日报记录',
                data: null,
            };
        }
        const filePath = path.resolve((0, config_1.default)().cachePath, history.fileName);
        if (!fs.existsSync(filePath)) {
            return {
                code: 500,
                msg: '无当日日报文件，请重新生成',
                data: null,
            };
        }
        const user = await this.userService.getUserByid(userId);
        const transporter = nodemailer.createTransport({
            host: user.emailHost,
            port: user.emailPort,
            secure: true,
            auth: {
                user: user.emailSend,
                pass: user.emailAuth,
            },
        });
        const htmlTable = (0, emailText_1.default)(filePath);
        const info = await transporter.sendMail({
            from: user.emailSend,
            to: user.emailReceiver,
            subject: history.fileName,
            html: htmlTable,
            attachments: [
                {
                    filename: history.fileName,
                    path: filePath,
                },
            ],
        });
        if (info.response.includes('Ok')) {
            history.hasSendEmail = true;
            await this.taskHistory.save(history);
            return {
                code: 200,
                msg: 'ok',
                data: null,
            };
        }
        else {
            return {
                code: 500,
                msg: '邮件发送失败',
                data: null,
            };
        }
    }
    async exportMonthly(userId, startDate, endDate, fileName) {
        const user = await this.userService.getUserByid(userId);
        if (!user.monthlyTemplate) {
            return {
                code: 500,
                msg: '请先设置月报模板',
                data: null,
            };
        }
        const filePath = path.resolve((0, config_1.default)().uploadsPath, user.monthlyTemplate);
        if (!fs.existsSync(filePath)) {
            return {
                code: 500,
                msg: '月报模板文件丢失，请重新上传',
                data: null,
            };
        }
        const templateData = await (0, readTemplate_1.default)(filePath);
        if (!fs.existsSync((0, config_1.default)().cachePath)) {
            fs.mkdirSync((0, config_1.default)().cachePath);
        }
        const cachePath = path.resolve((0, config_1.default)().cachePath, fileName);
        fs.copyFile(filePath, cachePath, (err) => {
            if (err) {
                return {
                    code: 500,
                    msg: '日报模板文件丢失，请重新上传',
                    data: null,
                };
            }
        });
        const tasks = await this.task.find({
            where: {
                user: {
                    id: userId,
                },
                date: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        if (!tasks || tasks.length === 0) {
            return {
                code: 500,
                msg: '数据为空',
                data: null,
            };
        }
        tasks.forEach((item, index) => {
            item['no'] = index + 1;
            item['fullTitle'] = item['mainTitle'] + '-' + item['title'];
        });
        const res = await (0, writeTemplate_1.default)(cachePath, tasks, templateData);
        if (res) {
            const his = await this.addTaskReportHistory(userId, fileName, 2, false, null, startDate, endDate);
            return {
                code: 200,
                msg: 'ok',
                data: his.data,
            };
        }
        else {
            return {
                code: 500,
                msg: '月报生成失败',
                data: null,
            };
        }
    }
    async addTaskReportHistory(userId, filename, reportType, hasSendEmail, reportDate = null, reportDateStart = null, reportDateEnd = null) {
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        const history = new taskHistory_1.TaskHistory();
        history.user = user;
        history.createTime = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
        history.fileName = filename;
        history.fileExist = true;
        history.reportType = reportType;
        history.hasSendEmail = hasSendEmail;
        if (reportDate) {
            history.reportDate = reportDate;
        }
        else {
            history.reportDate = '';
        }
        if (reportDateStart) {
            history.reportDateStart = reportDateStart;
        }
        else {
            history.reportDateStart = '';
        }
        if (reportDateEnd) {
            history.reportDateEnd = reportDateEnd;
        }
        else {
            history.reportDateEnd = '';
        }
        const hash = (0, createHash_1.default)(path.resolve((0, config_1.default)().cachePath, filename));
        if (hash.code === 1) {
            history.fileHash = hash.data;
        }
        else {
            history.fileHash = '';
        }
        await this.taskHistory.save(history);
        return {
            code: 200,
            msg: 'ok',
            data: history.id,
        };
    }
    async getHistoryList(userId, page, type) {
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        const where = {
            user: {
                id: userId,
            },
            reportType: type,
        };
        const historyList = await this.taskHistory.find({
            where,
            skip: (page - 1) * 10,
            take: 10,
            order: { id: 'DESC' },
        });
        const total = await this.taskHistory.count({
            where,
        });
        return {
            code: 200,
            msg: 'ok',
            data: {
                list: historyList,
                total: total,
            },
        };
    }
    async deleteHistoryFile(hisId, userId) {
        const history = await this.taskHistory.findOne({
            where: {
                id: hisId,
                user: {
                    id: userId,
                },
            },
        });
        if (!history) {
            return {
                code: 500,
                msg: '文件不存在',
                data: null,
            };
        }
        const filePath = path.resolve((0, config_1.default)().cachePath, history.fileName);
        if (!fs.existsSync(filePath)) {
            return {
                code: 500,
                msg: '文件不存在',
                data: null,
            };
        }
        fs.unlinkSync(filePath);
        history.fileExist = false;
        await this.taskHistory.save(history);
        return {
            code: 200,
            msg: 'ok',
            data: null,
        };
    }
    async downloadHistoryFile(userId, hisId) {
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        const history = await this.taskHistory.findOne({
            where: {
                id: hisId,
                user: {
                    id: userId,
                },
                fileExist: true,
            },
        });
        if (!history) {
            return {
                code: 500,
                msg: '文件不存在',
                data: null,
            };
        }
        return {
            code: 200,
            msg: 'ok',
            data: {
                filePath: path.resolve((0, config_1.default)().cachePath, history.fileName),
                fileName: history.fileName,
            },
        };
    }
    async getTaskByMonth(userId, year, month) {
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 500,
                msg: '用户不存在',
                data: null,
            };
        }
        const days = new Date(year, month, 0).getDate();
        const TaskLIst_estimate = [];
        const TaskLIst_actual = [];
        const HolidayData = await this.getHolidayData(`${year}-${month < 10 ? '0' + month : month}`);
        for (let i = 1; i <= days; i++) {
            const day = i < 10 ? '0' + i : i;
            const date = `${year}-${month < 10 ? '0' + month : month}-${day}`;
            const where = {
                user: {
                    id: userId,
                },
                estimatedStartDate: (0, typeorm_2.LessThanOrEqual)(date),
                estimatedEndDate: (0, typeorm_2.MoreThanOrEqual)(date),
            };
            const task = await this.task.findOne({
                where,
            });
            TaskLIst_estimate.push({
                day: i,
                date,
                task,
            });
            const where2 = {
                user: {
                    id: userId,
                },
                actualStartDate: (0, typeorm_2.LessThanOrEqual)(date),
                actualEndDate: (0, typeorm_2.MoreThanOrEqual)(date),
            };
            const task2 = await this.task.findOne({
                where: where2,
            });
            TaskLIst_actual.push({
                day: i,
                date,
                task: task2,
            });
        }
        return {
            code: 200,
            msg: 'ok',
            data: {
                holidayData: HolidayData,
                TaskLIst_estimate,
                TaskLIst_actual,
            },
        };
    }
    async getHolidayData(date) {
        const res = await this.httpService
            .get(`https://api.haoshenqi.top/holiday?date=${date}`)
            .toPromise()
            .then((res) => res.data);
        return res;
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(taskHistory_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        axios_1.HttpService])
], TaskService);
//# sourceMappingURL=task.service.js.map