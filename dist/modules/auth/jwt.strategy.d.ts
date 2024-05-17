import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: {
        id: number;
        username: string;
        email: string;
    }): Promise<{
        id: number;
        username: string;
        email: string;
    }>;
}
export {};
