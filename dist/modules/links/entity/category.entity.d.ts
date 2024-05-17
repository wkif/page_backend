import { Link } from './link.entity';
import { User } from 'src/modules/user/entity/user.entity';
export declare class Category {
    id: number;
    user: User;
    links: Link[];
    typename: string;
}
