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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const link_entity_1 = require("./link.entity");
const user_entity_1 = require("../../user/entity/user.entity");
let Category = class Category {
};
exports.Category = Category;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.links),
    __metadata("design:type", user_entity_1.User)
], Category.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => link_entity_1.Link, (link) => link.category),
    __metadata("design:type", Array)
], Category.prototype, "links", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Category.prototype, "typename", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)()
], Category);
//# sourceMappingURL=category.entity.js.map