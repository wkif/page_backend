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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../common/public.decorator");
const cryptogram_1 = require("../../utils/cryptogram");
const user_service_1 = require("./user.service");
const auth_service_1 = require("../auth/auth.service");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async register(data) {
        if (!data.username || !data.password || !data.email) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        const findByemail = await this.userService.findByemail(data.email);
        if (findByemail) {
            return {
                code: 500,
                msg: '邮箱已注册',
                data: {},
            };
        }
        const findByName = await this.userService.findByName(data.username);
        if (findByName) {
            return {
                code: 500,
                msg: '用户名已注册',
                data: {},
            };
        }
        const salt = (0, cryptogram_1.makeSalt)();
        const hashPwd = (0, cryptogram_1.encryptPassword)(data.password, salt);
        try {
            const res = await this.userService.create({
                email: data.email,
                salt: salt,
                hashPwd: hashPwd,
                username: data.username,
            });
            if (res) {
                return {
                    code: 200,
                    msg: '注册成功',
                    data: {},
                };
            }
        }
        catch (error) {
            return {
                code: 500,
                msg: error,
                data: {},
            };
        }
    }
    async Login(data) {
        const user = await this.userService.findByemail(data.email);
        if (user) {
            const hashedPassword = user.password;
            const salt = user.passwdSalt;
            const hashPassword = (0, cryptogram_1.encryptPassword)(data.password, salt);
            if (hashedPassword == hashPassword) {
                const { code, msg, data } = await this.authService.certificate(user);
                if (code === 200) {
                    return {
                        code: 200,
                        msg: '登录成功',
                        data: {
                            token: data.token,
                            userInfo: {
                                id: user.id,
                                email: user.email,
                                username: user.username,
                                avatar: user.avatar,
                            },
                        },
                    };
                }
                else {
                    return {
                        code: 400,
                        msg: msg,
                        data: {},
                    };
                }
            }
            else {
                return {
                    code: 400,
                    msg: '密码错误',
                    data: {},
                };
            }
        }
        else {
            return {
                code: 500,
                msg: '邮箱未注册',
                data: {},
            };
        }
    }
    async getUserInfo(params) {
        const { id } = params;
        const user = await this.userService.getUserByid(Number(id));
        if (user) {
            return {
                code: 200,
                msg: 'ok',
                data: {
                    id: id,
                    email: user.email,
                    username: user.username,
                    avatar: user.avatar,
                    dailyTemplateName: user.dailyTemplateName,
                    monthlyTemplateName: user.monthlyTemplateName,
                    emailSend: user.emailSend,
                    emailHost: user.emailHost,
                    emailPort: user.emailPort,
                    emailAuth: user.emailAuth,
                    emailReceiver: user.emailReceiver,
                    dailyTemplate: user.dailyTemplate,
                    monthlyTemplate: user.monthlyTemplate,
                },
            };
        }
        else {
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
    }
    async updateUserInfo(data) {
        const { id, email, username, avatar, dailyTemplateName, monthlyTemplateName, emailSend, emailHost, emailPort, emailAuth, emailReceiver, } = data;
        const user = await this.userService.getUserByid(id);
        if (!user) {
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
        const res = await this.userService.updateUserInfo(id, email, username, avatar, dailyTemplateName, monthlyTemplateName, emailSend, emailHost, emailPort, emailAuth, emailReceiver);
        if (res) {
            return {
                code: 200,
                msg: 'ok',
                data: {},
            };
        }
        else {
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Login", null);
__decorate([
    (0, common_1.Get)('getUserInfo/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Post)('updateUserInfo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserInfo", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=user.controller.js.map