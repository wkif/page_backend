import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';

import config from 'src/config/index';
const { uploadsPath } = config()();
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private user: Repository<User>) {}
  create({ email, salt, hashPwd, username }) {
    const user = new User();
    user.email = email;
    user.avatar = '';
    user.isactive = true;
    user.passwdSalt = salt;
    user.password = hashPwd;
    user.username = username;
    return this.user.save(user);
  }
  findByemail(email: string) {
    return this.user.findOne({
      where: {
        email,
      },
    });
  }
  async findByName(username: string) {
    const user = await this.user.findOne({
      where: {
        username,
      },
    });
    if (user) {
      return user;
    } else {
      return void 0;
    }
  }
  async getUserByid(id: number) {
    const user = await this.user.findOne({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      return void 0;
    }
  }
  async updateUserInfo(
    id: number,
    email: string,
    username: string,
    avatar: string,
    dailyTemplateName: string,
    monthlyTemplateName: string,
    emailSend: string,
    emailHost: string,
    emailPort: string,
    emailAuth: string,
    emailReceiver: string,
  ) {
    const user = await this.user.findOne({
      where: {
        id,
      },
    });
    if (email) user.email = email;
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    if (dailyTemplateName) user.dailyTemplateName = dailyTemplateName;
    if (monthlyTemplateName) user.monthlyTemplateName = monthlyTemplateName;
    if (emailSend) user.emailSend = emailSend;
    if (emailHost) user.emailHost = emailHost;
    if (emailPort) user.emailPort = emailPort;
    if (emailAuth) user.emailAuth = emailAuth;
    if (emailReceiver) user.emailReceiver = emailReceiver;
    return this.user.save(user);
  }
  async updateNewsTypes(id: number, newsTypes: string) {
    const user = await this.user.findOne({
      where: {
        id,
      },
    });
    if (newsTypes) user.newsTypes = newsTypes;
    return this.user.save(user);
  }

  async getTemplate(id: number, type: number) {
    const user = await this.user.findOne({
      where: {
        id,
      },
    });
    if (type == 1) {
      const filePath = path.resolve(uploadsPath, user.dailyTemplate);
      if (!fs.existsSync(filePath)) {
        return false;
      }
      return filePath;
    } else if (type == 2) {
      const filePath = path.resolve(uploadsPath, user.monthlyTemplate);
      if (!fs.existsSync(filePath)) {
        return false;
      }
      return filePath;
    }
  }
}
