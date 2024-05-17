import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    certificate(user: {
        id: number;
        username: string;
        email: string;
    }): Promise<{
        code: number;
        data: {
            token: string;
        };
        msg: string;
    } | {
        code: number;
        msg: string;
        data: {
            token?: undefined;
        };
    }>;
}
