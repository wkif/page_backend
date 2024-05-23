import { Body, Controller, Post, HttpCode, Get, Param } from '@nestjs/common';
import { Result } from 'src/common/result.interface';
import { Public } from 'src/common/public.decorator';

// 引入加密函数
import { makeSalt, encryptPassword } from '../../utils/cryptogram';

import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(200)
  async register(
    @Body() data: { username: string; password: string; email: string },
  ): Promise<Result> {
    if (!data.username || !data.password || !data.email) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    const findByemail = await this.userService.findByemail(data.email);
    if (findByemail) {
      return {
        code: 500,
        msg: '邮箱已注册',
        data: {},
      };
    }
    const findByName = await this.userService.findByName(data.username);
    if (findByName) {
      return {
        code: 500,
        msg: '用户名已注册',
        data: {},
      };
    }
    const salt = makeSalt();
    const hashPwd = encryptPassword(data.password, salt);

    try {
      const res = await this.userService.create({
        email: data.email,
        salt: salt,
        hashPwd: hashPwd,
        username: data.username,
      });
      if (res) {
        return {
          code: 200,
          msg: '注册成功',
          data: {},
        };
      }
    } catch (error) {
      return {
        code: 500,
        msg: error,
        data: {},
      };
    }
  }

  @Public()
  @Post('login')
  async Login(
    @Body() data: { email: string; password: string },
  ): Promise<Result> {
    const user = await this.userService.findByemail(data.email);

    if (user) {
      const hashedPassword = user.password;
      const salt = user.passwdSalt;
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const hashPassword = encryptPassword(data.password, salt);
      if (hashedPassword == hashPassword) {
        // 密码正确
        // return this.authService.certificate(user);
        const { code, msg, data } = await this.authService.certificate(user);
        if (code === 200) {
          return {
            code: 200,
            msg: '登录成功',
            data: {
              token: data.token,
              userInfo: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                newsTypes: user.newsTypes,
              },
            },
          };
        } else {
          return {
            code: 400,
            msg: msg,
            data: {},
          };
        }
      } else {
        // 密码错误
        return {
          code: 400,
          msg: '密码错误',
          data: {},
        };
      }
    } else {
      return {
        code: 500,
        msg: '邮箱未注册',
        data: {},
      };
    }
  }

  @Get('getUserInfo/:id')
  async getUserInfo(@Param() params: { id: number }) {
    const { id } = params;
    const user = await this.userService.getUserByid(Number(id));
    if (user) {
      return {
        code: 200,
        msg: 'ok',
        data: {
          id: id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          dailyTemplateName: user.dailyTemplateName,
          monthlyTemplateName: user.monthlyTemplateName,
          emailSend: user.emailSend,
          emailHost: user.emailHost,
          emailPort: user.emailPort,
          emailAuth: user.emailAuth,
          emailReceiver: user.emailReceiver,
          dailyTemplate: user.dailyTemplate,
          monthlyTemplate: user.monthlyTemplate,
          newsTypes: user.newsTypes,
        },
      };
    } else {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
  }

  // 修改信息
  @Post('updateUserInfo')
  async updateUserInfo(
    @Body()
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
    },
  ) {
    const {
      id,
      email,
      username,
      avatar,
      dailyTemplateName,
      monthlyTemplateName,
      emailSend,
      emailHost,
      emailPort,
      emailAuth,
      emailReceiver,
    } = data;
    const user = await this.userService.getUserByid(id);
    if (!user) {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
    const res = await this.userService.updateUserInfo(
      id,
      email,
      username,
      avatar,
      dailyTemplateName,
      monthlyTemplateName,
      emailSend,
      emailHost,
      emailPort,
      emailAuth,
      emailReceiver,
    );
    if (res) {
      return {
        code: 200,
        msg: 'ok',
        data: {},
      };
    } else {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
  }
  @Post('updateNewsTypes')
  async updateNewsTypes(@Body() data: { id: number; newsTypes: string }) {
    const { id, newsTypes } = data;
    const user = await this.userService.getUserByid(id);
    if (!user) {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
    const res = await this.userService.updateNewsTypes(id, newsTypes);
    if (res) {
      return {
        code: 200,
        msg: 'ok',
        data: {},
      };
    } else {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
  }
}
