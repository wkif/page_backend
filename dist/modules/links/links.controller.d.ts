import { LinksService } from './links.service';
import type LinkType from './entity/link.type';
export declare class LinksController {
    private readonly linksService;
    constructor(linksService: LinksService);
    addCategory(data: {
        name: string;
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    deleteCategory(data: {
        id: number;
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    getCategoryList(params: {
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            categoryList: import("src/modules/links/entity/category.entity").Category[];
        };
    }>;
    addLink(data: LinkType): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    getLinks(params: {
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            categoryList: import("src/modules/links/entity/category.entity").Category[];
            links: import("src/modules/links/entity/link.entity").Link[];
        };
    }>;
    deleteLink(data: {
        id: number;
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    getLinkTableList(data: {
        userId: number;
        page: number;
        title: string;
        catId: number;
        url: string;
        tags: string;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            links?: undefined;
            total?: undefined;
            totalPage?: undefined;
        };
    } | {
        code: number;
        msg: string;
        data: {
            links: import("src/modules/links/entity/link.entity").Link[];
            total: number;
            totalPage: number;
        };
    }>;
}
