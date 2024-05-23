import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { Public } from './common/public.decorator';
import { map } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('searchAdvice')
  async searchAdvice(@Body() data: { keyword: string }) {
    const res: any = this.httpService
      .get(`https://api.52vmy.cn/api/wl/word/bing?msg=${data.keyword}`)
      .pipe(map((res) => res.data));
    return res;
  }

  @Public()
  @Post('getLunarDate')
  async getLunarDate(@Body() data: { date: string }) {
    const res: any = this.httpService
      .get(`https://www.36jxs.com/api/Commonweal/almanac?sun=${data.date}`)
      .pipe(map((res) => res.data));
    return res;
  }

  @Public()
  @Post('getHolidayData')
  async getHolidayData(@Body() data: { date: string }) {
    const res = await this.httpService
      .get(`https://api.apihubs.cn/holiday/get?date=${data.date}&cn=1&size=31`)
      .pipe(map((res) => res.data));
    return res;
  }
  @Public()
  @Get('getNewsApi/:type')
  async getNewsApi(@Param() params: { type: string }) {
    const res = await this.httpService
      .get(`https://api-hot.efefee.cn/${params.type}?cache=true`)
      .pipe(map((res) => res.data));
    return res;
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return await this.appService.uploadFile(file);
  // }
}
