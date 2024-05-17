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
exports.LinksController = void 0;
const common_1 = require("@nestjs/common");
const links_service_1 = require("./links.service");
let LinksController = class LinksController {
    constructor(linksService) {
        this.linksService = linksService;
    }
    async addCategory(data) {
        if (!data.name || !data.userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.linksService.addCategory(data);
    }
    async deleteCategory(data) {
        if (!data.id || !data.userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.linksService.deleteCategory(data);
    }
    async getCategoryList(params) {
        return await this.linksService.getCategoryList(params.userId);
    }
    async addLink(data) {
        if (!data.title || !data.url || !data.userId || !data.categoryId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.linksService.addLink(data);
    }
    async getLinks(params) {
        return await this.linksService.getLinks(params.userId);
    }
    async deleteLink(data) {
        if (!data.id || !data.userId) {
            return {
                code: 500,
                msg: '请完整填写信息',
                data: {},
            };
        }
        return await this.linksService.deleteLink(data);
    }
    async getLinkTableList(data) {
        return await this.linksService.getLinkTableList(data);
    }
};
exports.LinksController = LinksController;
__decorate([
    (0, common_1.Post)('addCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Post)('deleteCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('getCategoryList/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getCategoryList", null);
__decorate([
    (0, common_1.Post)('addLink'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "addLink", null);
__decorate([
    (0, common_1.Get)('getLinks/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getLinks", null);
__decorate([
    (0, common_1.Post)('deleteLink'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "deleteLink", null);
__decorate([
    (0, common_1.Post)('getLinkTableList'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getLinkTableList", null);
exports.LinksController = LinksController = __decorate([
    (0, common_1.Controller)('links'),
    __metadata("design:paramtypes", [links_service_1.LinksService])
], LinksController);
//# sourceMappingURL=links.controller.js.map