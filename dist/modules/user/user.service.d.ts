import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private user;
    constructor(user: Repository<User>);
    create({ email, salt, hashPwd, username }: {
        email: any;
        salt: any;
        hashPwd: any;
        username: any;
    }): Promise<User>;
    findByemail(email: string): Promise<User>;
    findByName(username: string): Promise<User>;
    getUserByid(id: number): Promise<User>;
    updateUserInfo(id: number, email: string, username: string, avatar: string, dailyTemplateName: string, monthlyTemplateName: string, emailSend: string, emailHost: string, emailPort: string, emailAuth: string, emailReceiver: string): Promise<User>;
    addTemplate(id: number, template: string, type: number): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    getTemplate(id: number, type: number): Promise<string | false>;
}
