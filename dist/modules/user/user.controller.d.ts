import { Result } from 'src/common/result.interface';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    register(data: {
        username: string;
        password: string;
        email: string;
    }): Promise<Result>;
    Login(data: {
        email: string;
        password: string;
    }): Promise<Result>;
    getUserInfo(params: {
        id: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            id: number;
            email: string;
            username: string;
            avatar: string;
            dailyTemplateName: string;
            monthlyTemplateName: string;
            emailSend: string;
            emailHost: string;
            emailPort: string;
            emailAuth: string;
            emailReceiver: string;
            dailyTemplate: string;
            monthlyTemplate: string;
        };
    } | {
        code: number;
        msg: string;
        data: {
            id?: undefined;
            email?: undefined;
            username?: undefined;
            avatar?: undefined;
            dailyTemplateName?: undefined;
            monthlyTemplateName?: undefined;
            emailSend?: undefined;
            emailHost?: undefined;
            emailPort?: undefined;
            emailAuth?: undefined;
            emailReceiver?: undefined;
            dailyTemplate?: undefined;
            monthlyTemplate?: undefined;
        };
    }>;
    updateUserInfo(data: {
        id: number;
        email: string;
        username: string;
        avatar: string;
        dailyTemplateName: string;
        monthlyTemplateName: string;
        emailSend: string;
        emailHost: string;
        emailPort: string;
        emailAuth: string;
        emailReceiver: string;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
}
