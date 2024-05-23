import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import LinkType from './entity/link.type';
import { UserService } from '../user/user.service';
import { Link } from './entity/link.entity';
import { Category } from './entity/category.entity';
@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private link: Repository<Link>,
    @InjectRepository(Category) private category: Repository<Category>,
    private readonly userService: UserService,
  ) {}

  // 添加分类
  async addCategory(data: { name: string; userId: number }) {
    const user = await this.userService.getUserByid(data.userId);
    if (!user) {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
    const category1 = await this.category.findOne({
      where: {
        typename: data.name,
        user: { id: user.id },
      },
    });
    console.log('category1', category1);
    if (category1) {
      return {
        code: 401,
        msg: 'category exists',
        data: {},
      };
    }
    const category = new Category();
    category.typename = data.name;
    category.user = user;
    await this.category.save(category);
    return {
      code: 200,
      msg: 'ok',
      data: {},
    };
  }

  // delete category
  async deleteCategory(data: { id: number; userId: number }) {
    const user = await this.userService.getUserByid(data.userId);
    if (!user) {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
    const category = await this.category.findOne({
      where: {
        id: data.id,
        user: { id: user.id },
      },
    });
    if (!category) {
      return {
        code: 402,
        msg: 'no category',
        data: {},
      };
    }
    const links = await this.link.find({
      where: {
        category: { id: category.id },
      },
    });
    if (links.length > 0) {
      return {
        code: 403,
        msg: 'category has links',
        data: {},
      };
    }
    await this.category.remove(category);
    return {
      code: 200,
      msg: 'ok',
      data: {},
    };
  }

  async getCategoryList(userId: number) {
    const categoryList = await this.category.find({
      where: { user: { id: userId } },
    });
    return {
      code: 200,
      msg: 'ok',
      data: {
        categoryList,
      },
    };
  }
  // 添加链接

  async addLink(data: LinkType) {
    try {
      const user = await this.userService.getUserByid(data.userId);
      if (!user) {
        return {
          code: 400,
          msg: 'no user',
          data: {},
        };
      }
      const exitLink = await this.link.findOne({
        where: {
          url: data.url,
          user: { id: user.id },
        },
      });
      if (exitLink) {
        return {
          code: 401,
          msg: 'link exists',
          data: {},
        };
      }
      const category = await this.category.findOne({
        where: {
          id: data.categoryId,
          user: { id: user.id },
        },
      });
      if (!category) {
        return {
          code: 402,
          msg: 'no category',
          data: {},
        };
      }
      const link = new Link();
      link.user = user;
      link.title = data.title;
      link.url = data.url;
      link.description = data.description ? data.description : '暂无描述';
      link.category = category;
      link.tags = data.tags ? data.tags : '';
      link.github = data.github ? data.github : '';
      await this.link.save(link);
      return {
        code: 200,
        msg: 'ok',
        data: {},
      };
    } catch (e) {
      console.log('e', e);
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
  }

  async getLinkById(id: number, userId: number) {
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: 'no user',
        data: {},
      };
    }
    const link = await this.link.findOne({
      relations: ['category'],
      where: {
        id,
        user: { id: user.id },
      },
    });
    if (!link) {
      return {
        code: 500,
        msg: 'no link',
        data: {},
      };
    }
    const data = JSON.parse(JSON.stringify(link));
    data.categoryId = link.category.id;
    delete data.category;
    return {
      code: 200,
      msg: 'ok',
      data,
    };
  }
  async editLink(data: LinkType) {
    const { id, title, description, url, userId, categoryId, tags, github } =
      data;
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
    const link = await this.link.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });
    if (!link) {
      return {
        code: 402,
        msg: 'no link',
        data: {},
      };
    }
    const category = await this.category.findOne({
      where: {
        id: categoryId,
        user: { id: user.id },
      },
    });
    if (!category) {
      return {
        code: 402,
        msg: 'no category',
        data: {},
      };
    }
    link.title = title;
    link.url = url;
    link.description = description;
    link.category = category;
    link.tags = tags;
    link.github = github;
    await this.link.save(link);
    return {
      code: 200,
      msg: 'ok',
      data: {},
    };
  }

  async getLinks(userId: number) {
    const links = await this.link.find({
      relations: ['category'],
      where: { user: { id: userId } },
    });
    const categoryList = await this.category.find({
      where: { user: { id: userId } },
    });
    return {
      code: 200,
      msg: 'ok',
      data: {
        categoryList,
        links,
      },
    };
  }
  // 删除链接
  async deleteLink(data: { id: number; userId: number }) {
    const user = await this.userService.getUserByid(data.userId);
    if (!user) {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
    const link = await this.link.findOne({
      where: {
        id: data.id,
        user: { id: user.id },
      },
    });
    if (!link) {
      return {
        code: 402,
        msg: 'no link',
        data: {},
      };
    }
    await this.link.remove(link);
    return {
      code: 200,
      msg: 'ok',
      data: {},
    };
  }
  async getLinkTableList(data: {
    userId: number;
    page: number;
    title: string;
    catId: number;
    url: string;
    tags: string;
  }) {
    const { userId, page, title, catId, url, tags } = data;
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 400,
        msg: 'no user',
        data: {},
      };
    }
    const where = {
      user: { id: userId },
      title: Like(`%${title}%`),
      category: { id: catId },
      url: Like(`%${url}%`),
      tags: Like(`%${tags}%`),
    };
    if (!title) {
      delete where.title;
    }
    if (!catId) {
      delete where.category;
    }
    if (!url) {
      delete where.url;
    }
    if (!tags) {
      delete where.tags;
    }
    const links = await this.link.find({
      relations: ['category'],
      where,
      skip: (page - 1) * 10,
      take: 10,
      order: {
        id: 'DESC',
      },
    });
    const total = await this.link.count({
      where,
    });
    const totalPage = Math.ceil(total / 10);
    return {
      code: 200,
      msg: 'ok',
      data: {
        links,
        total,
        totalPage,
      },
    };
  }
}
