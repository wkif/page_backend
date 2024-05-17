import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly httpService;
    constructor(appService: AppService, httpService: HttpService);
    getHello(): string;
    searchAdvice(data: {
        keyword: string;
    }): Promise<any>;
    getLunarDate(data: {
        date: string;
    }): Promise<any>;
    getHolidayData(data: {
        date: string;
    }): Promise<import("rxjs").Observable<any>>;
}
