import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async certificate(user: { id: number; username: string; email: string }) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    try {
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });
      return {
        code: 200,
        data: {
          token,
        },
        msg: `登录成功`,
      };
    } catch (error) {
      console.log('error', error);
      return {
        code: 600,
        msg: 'login fail',
        data: {},
      };
    }
  }
}
