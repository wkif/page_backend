import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LinksService } from './links.service';
import type LinkType from './entity/link.type';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  // add category

  @Post('addCategory')
  async addCategory(
    @Body()
    data: {
      name: string;
      userId: number;
    },
  ) {
    if (!data.name || !data.userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.linksService.addCategory(data);
  }

  // delete category
  @Post('deleteCategory')
  async deleteCategory(@Body() data: { id: number; userId: number }) {
    if (!data.id || !data.userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.linksService.deleteCategory(data);
  }

  // get category list
  @Get('getCategoryList/:userId')
  async getCategoryList(@Param() params: { userId: number }) {
    return await this.linksService.getCategoryList(params.userId);
  }

  // add link
  @Post('addLink')
  async addLink(
    @Body()
    data: LinkType,
  ) {
    if (!data.title || !data.url || !data.userId || !data.categoryId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.linksService.addLink(data);
  }
  // get links
  @Get('getLinks/:userId')
  async getLinks(@Param() params: { userId: number }) {
    return await this.linksService.getLinks(params.userId);
  }

  // delete link
  @Post('deleteLink')
  async deleteLink(@Body() data: { id: number; userId: number }) {
    if (!data.id || !data.userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.linksService.deleteLink(data);
  }

  // get link table list
  @Post('getLinkTableList')
  async getLinkTableList(
    @Body()
    data: {
      userId: number;
      page: number;
      title: string;
      catId: number;
      url: string;
      tags: string;
    },
  ) {
    return await this.linksService.getLinkTableList(data);
  }
}
