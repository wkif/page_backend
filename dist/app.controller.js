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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const app_service_1 = require("./app.service");
const public_decorator_1 = require("./common/public.decorator");
const operators_1 = require("rxjs/operators");
let AppController = class AppController {
    constructor(appService, httpService) {
        this.appService = appService;
        this.httpService = httpService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async searchAdvice(data) {
        const res = this.httpService
            .get(`https://api.52vmy.cn/api/wl/word/bing?msg=${data.keyword}`)
            .pipe((0, operators_1.map)((res) => res.data));
        return res;
    }
    async getLunarDate(data) {
        const res = this.httpService
            .get(`https://www.36jxs.com/api/Commonweal/almanac?sun=${data.date}`)
            .pipe((0, operators_1.map)((res) => res.data));
        return res;
    }
    async getHolidayData(data) {
        const res = await this.httpService
            .get(`https://api.apihubs.cn/holiday/get?date=${data.date}&cn=1&size=31`)
            .pipe((0, operators_1.map)((res) => res.data));
        return res;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('searchAdvice'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "searchAdvice", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('getLunarDate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getLunarDate", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('getHolidayData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHolidayData", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        axios_1.HttpService])
], AppController);
//# sourceMappingURL=app.controller.js.map