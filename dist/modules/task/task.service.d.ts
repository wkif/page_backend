import { Task } from './entity/task.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TaskHistory } from './entity/taskHistory';
import { HttpService } from '@nestjs/axios';
export declare class TaskService {
    private task;
    private taskHistory;
    private readonly userService;
    private readonly httpService;
    constructor(task: Repository<Task>, taskHistory: Repository<TaskHistory>, userService: UserService, httpService: HttpService);
    getTaskById(id: any, userId: any): Promise<{
        code: number;
        msg: string;
        data: Task;
    }>;
    addTask(userId: any, title: any, mainTitle: any, date: any, arranger: any, estimatedWorkingHours: any, estimatedStartDate: any, estimatedEndDate: any, actualWorkingHours: any, actualStartDate: any, actualEndDate: any, status: any, progress: any, remarks: any, level: any): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    editTask(id: any, userId: any, title: any, mainTitle: any, date: any, arranger: any, estimatedWorkingHours: any, estimatedStartDate: any, estimatedEndDate: any, actualWorkingHours: any, actualStartDate: any, actualEndDate: any, status: any, progress: any, remarks: any, level: any): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    getTaskList(userId: any, page: any, status: any, title: any, mainTitle: any, date: any, level: any): Promise<{
        code: number;
        msg: string;
        data: {
            tasks: Task[];
            total: number;
        };
    }>;
    deleteTask(id: any, userId: any): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    exportDaily(userId: any, date: any, fileName: any): Promise<{
        code: number;
        msg: string;
        data: number;
    }>;
    sendDailyEmail(userId: any, hisId: any): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    exportMonthly(userId: any, startDate: any, endDate: any, fileName: any): Promise<{
        code: number;
        msg: string;
        data: number;
    }>;
    addTaskReportHistory(userId: any, filename: any, reportType: any, hasSendEmail: any, reportDate?: any, reportDateStart?: any, reportDateEnd?: any): Promise<{
        code: number;
        msg: string;
        data: number;
    }>;
    getHistoryList(userId: any, page: any, type: any): Promise<{
        code: number;
        msg: string;
        data: {
            list: TaskHistory[];
            total: number;
        };
    }>;
    deleteHistoryFile(hisId: any, userId: any): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    downloadHistoryFile(userId: any, hisId: any): Promise<{
        code: number;
        msg: string;
        data: {
            filePath: string;
            fileName: string;
        };
    }>;
    getTaskByMonth(userId: any, year: any, month: any): Promise<{
        code: number;
        msg: string;
        data: {
            holidayData: any;
            TaskLIst_estimate: any[];
            TaskLIst_actual: any[];
        };
    }>;
    getHolidayData(date: any): Promise<any>;
}
