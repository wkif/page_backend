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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const link_entity_1 = require("../../links/entity/link.entity");
const task_entity_1 = require("../../task/entity/task.entity");
const taskHistory_1 = require("../../task/entity/taskHistory");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "passwdSalt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "isactive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => link_entity_1.Link, (link) => link.user),
    __metadata("design:type", Array)
], User.prototype, "links", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, (task) => task.user),
    __metadata("design:type", Array)
], User.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => taskHistory_1.TaskHistory, (taskhistory) => taskhistory.user),
    __metadata("design:type", Array)
], User.prototype, "taskhistory", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "dailyTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "dailyTemplateName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "monthlyTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "monthlyTemplateName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "emailSend", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "emailHost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "emailPort", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "emailAuth", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "emailReceiver", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map