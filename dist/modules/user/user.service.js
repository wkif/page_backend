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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entity/user.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const path = require("path");
const fs = require("fs");
const config_1 = require("../../config");
let UserService = class UserService {
    constructor(user) {
        this.user = user;
    }
    create({ email, salt, hashPwd, username }) {
        const user = new user_entity_1.User();
        user.email = email;
        user.avatar = '';
        user.isactive = true;
        user.passwdSalt = salt;
        user.password = hashPwd;
        user.username = username;
        return this.user.save(user);
    }
    findByemail(email) {
        return this.user.findOne({
            where: {
                email,
            },
        });
    }
    async findByName(username) {
        const user = await this.user.findOne({
            where: {
                username,
            },
        });
        if (user) {
            return user;
        }
        else {
            return void 0;
        }
    }
    async getUserByid(id) {
        const user = await this.user.findOne({
            where: {
                id,
            },
        });
        if (user) {
            return user;
        }
        else {
            return void 0;
        }
    }
    async updateUserInfo(id, email, username, avatar, dailyTemplateName, monthlyTemplateName, emailSend, emailHost, emailPort, emailAuth, emailReceiver) {
        const user = await this.user.findOne({
            where: {
                id,
            },
        });
        if (email)
            user.email = email;
        if (username)
            user.username = username;
        if (avatar)
            user.avatar = avatar;
        if (dailyTemplateName)
            user.dailyTemplateName = dailyTemplateName;
        if (monthlyTemplateName)
            user.monthlyTemplateName = monthlyTemplateName;
        if (emailSend)
            user.emailSend = emailSend;
        if (emailHost)
            user.emailHost = emailHost;
        if (emailPort)
            user.emailPort = emailPort;
        if (emailAuth)
            user.emailAuth = emailAuth;
        if (emailReceiver)
            user.emailReceiver = emailReceiver;
        return this.user.save(user);
    }
    async addTemplate(id, template, type) {
        console.log('type', type, template);
        const user = await this.user.findOne({
            where: {
                id,
            },
        });
        if (type == 1) {
            if (user.dailyTemplate) {
                const filePath = path.resolve((0, config_1.default)().uploadsPath, user.dailyTemplate);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            user.dailyTemplate = template;
        }
        else if (type == 2) {
            if (user.monthlyTemplate) {
                const filePath = path.resolve((0, config_1.default)().uploadsPath, user.monthlyTemplate);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            user.monthlyTemplate = template;
        }
        await this.user.save(user);
        return {
            code: 200,
            msg: 'ok',
            data: {},
        };
    }
    async getTemplate(id, type) {
        const user = await this.user.findOne({
            where: {
                id,
            },
        });
        if (type == 1) {
            const filePath = path.resolve((0, config_1.default)().uploadsPath, user.dailyTemplate);
            if (!fs.existsSync(filePath)) {
                return false;
            }
            return filePath;
        }
        else if (type == 2) {
            const filePath = path.resolve((0, config_1.default)().uploadsPath, user.monthlyTemplate);
            if (!fs.existsSync(filePath)) {
                return false;
            }
            return filePath;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map