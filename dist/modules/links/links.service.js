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
exports.LinksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_service_1 = require("../user/user.service");
const link_entity_1 = require("./entity/link.entity");
const category_entity_1 = require("./entity/category.entity");
let LinksService = class LinksService {
    constructor(link, category, userService) {
        this.link = link;
        this.category = category;
        this.userService = userService;
    }
    async addCategory(data) {
        const user = await this.userService.getUserByid(data.userId);
        if (!user) {
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
        const category1 = await this.category.findOne({
            where: {
                typename: data.name,
                user: { id: user.id },
            },
        });
        console.log('category1', category1);
        if (category1) {
            return {
                code: 401,
                msg: 'category exists',
                data: {},
            };
        }
        const category = new category_entity_1.Category();
        category.typename = data.name;
        category.user = user;
        await this.category.save(category);
        return {
            code: 200,
            msg: 'ok',
            data: {},
        };
    }
    async deleteCategory(data) {
        const user = await this.userService.getUserByid(data.userId);
        if (!user) {
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
        const category = await this.category.findOne({
            where: {
                id: data.id,
                user: { id: user.id },
            },
        });
        if (!category) {
            return {
                code: 402,
                msg: 'no category',
                data: {},
            };
        }
        const links = await this.link.find({
            where: {
                category: { id: category.id },
            },
        });
        if (links.length > 0) {
            return {
                code: 403,
                msg: 'category has links',
                data: {},
            };
        }
        await this.category.remove(category);
        return {
            code: 200,
            msg: 'ok',
            data: {},
        };
    }
    async getCategoryList(userId) {
        const categoryList = await this.category.find({
            where: { user: { id: userId } },
        });
        return {
            code: 200,
            msg: 'ok',
            data: {
                categoryList,
            },
        };
    }
    async addLink(data) {
        try {
            const user = await this.userService.getUserByid(data.userId);
            if (!user) {
                return {
                    code: 400,
                    msg: 'no user',
                    data: {},
                };
            }
            const exitLink = await this.link.findOne({
                where: {
                    url: data.url,
                    user: { id: user.id },
                },
            });
            if (exitLink) {
                return {
                    code: 401,
                    msg: 'link exists',
                    data: {},
                };
            }
            const category = await this.category.findOne({
                where: {
                    id: data.categoryId,
                    user: { id: user.id },
                },
            });
            if (!category) {
                return {
                    code: 402,
                    msg: 'no category',
                    data: {},
                };
            }
            const link = new link_entity_1.Link();
            link.user = user;
            link.title = data.title;
            link.url = data.url;
            link.description = data.description ? data.description : '暂无描述';
            link.category = category;
            link.tags = data.tags ? data.tags : '';
            link.github = data.github ? data.github : '';
            await this.link.save(link);
            return {
                code: 200,
                msg: 'ok',
                data: {},
            };
        }
        catch (e) {
            console.log('e', e);
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
    }
    async getLinks(userId) {
        const links = await this.link.find({
            relations: ['category'],
            where: { user: { id: userId } },
        });
        const categoryList = await this.category.find({
            where: { user: { id: userId } },
        });
        return {
            code: 200,
            msg: 'ok',
            data: {
                categoryList,
                links,
            },
        };
    }
    async deleteLink(data) {
        const user = await this.userService.getUserByid(data.userId);
        if (!user) {
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
        const link = await this.link.findOne({
            where: {
                id: data.id,
                user: { id: user.id },
            },
        });
        if (!link) {
            return {
                code: 402,
                msg: 'no link',
                data: {},
            };
        }
        await this.link.remove(link);
        return {
            code: 200,
            msg: 'ok',
            data: {},
        };
    }
    async getLinkTableList(data) {
        const { userId, page, title, catId, url, tags } = data;
        const user = await this.userService.getUserByid(userId);
        if (!user) {
            return {
                code: 400,
                msg: 'no user',
                data: {},
            };
        }
        const where = {
            user: { id: userId },
            title: (0, typeorm_1.Like)(`%${title}%`),
            category: { id: catId },
            url: (0, typeorm_1.Like)(`%${url}%`),
            tags: (0, typeorm_1.Like)(`%${tags}%`),
        };
        if (!title) {
            delete where.title;
        }
        if (!catId) {
            delete where.category;
        }
        if (!url) {
            delete where.url;
        }
        if (!tags) {
            delete where.tags;
        }
        const links = await this.link.find({
            relations: ['category'],
            where,
            skip: (page - 1) * 10,
            take: 10,
            order: {
                id: 'DESC',
            },
        });
        const total = await this.link.count({
            where,
        });
        const totalPage = Math.ceil(total / 10);
        return {
            code: 200,
            msg: 'ok',
            data: {
                links,
                total,
                totalPage,
            },
        };
    }
};
exports.LinksService = LinksService;
exports.LinksService = LinksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(link_entity_1.Link)),
    __param(1, (0, typeorm_2.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        user_service_1.UserService])
], LinksService);
//# sourceMappingURL=links.service.js.map