import { Repository } from 'typeorm';
import LinkType from './entity/link.type';
import { UserService } from '../user/user.service';
import { Link } from './entity/link.entity';
import { Category } from './entity/category.entity';
export declare class LinksService {
    private link;
    private category;
    private readonly userService;
    constructor(link: Repository<Link>, category: Repository<Category>, userService: UserService);
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
    getCategoryList(userId: number): Promise<{
        code: number;
        msg: string;
        data: {
            categoryList: Category[];
        };
    }>;
    addLink(data: LinkType): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    getLinks(userId: number): Promise<{
        code: number;
        msg: string;
        data: {
            categoryList: Category[];
            links: Link[];
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
            links: Link[];
            total: number;
            totalPage: number;
        };
    }>;
}
