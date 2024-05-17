"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksModule = void 0;
const common_1 = require("@nestjs/common");
const links_controller_1 = require("./links.controller");
const links_service_1 = require("./links.service");
const user_entity_1 = require("../user/entity/user.entity");
const user_service_1 = require("../user/user.service");
const typeorm_1 = require("@nestjs/typeorm");
const link_entity_1 = require("./entity/link.entity");
const category_entity_1 = require("./entity/category.entity");
let LinksModule = class LinksModule {
};
exports.LinksModule = LinksModule;
exports.LinksModule = LinksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, link_entity_1.Link, category_entity_1.Category])],
        controllers: [links_controller_1.LinksController],
        providers: [links_service_1.LinksService, user_service_1.UserService],
    })
], LinksModule);
//# sourceMappingURL=links.module.js.map