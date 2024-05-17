import { User } from 'src/modules/user/entity/user.entity';
import { Category } from './category.entity';
export declare class Link {
    id: number;
    user: User;
    title: string;
    url: string;
    description: string;
    category: Category;
    tags: string;
    github: string;
}
