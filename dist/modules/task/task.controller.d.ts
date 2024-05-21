/// <reference types="multer" />
import { Response } from 'express';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { AppService } from 'src/app.service';
export declare class TaskController {
    private readonly taskService;
    private readonly userService;
    private readonly appService;
    constructor(taskService: TaskService, userService: UserService, appService: AppService);
    addTask(data: {
        userId: number;
        title: string;
        mainTitle: string;
        date: string;
        arranger: string;
        estimatedWorkingHours: number;
        estimatedStartDate: string;
        estimatedEndDate: string;
        actualWorkingHours: number;
        actualStartDate: string;
        actualEndDate: string;
        status: string;
        progress: number;
        remarks: string;
        level: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    editTask(data: {
        id: number;
        userId: number;
        title: string;
        mainTitle: string;
        date: string;
        arranger: string;
        estimatedWorkingHours: number;
        estimatedStartDate: string;
        estimatedEndDate: string;
        actualWorkingHours: number;
        actualStartDate: string;
        actualEndDate: string;
        status: string;
        progress: number;
        remarks: string;
        level: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    getTaskList(data: {
        userId: number;
        page: number;
        status: string;
        title: string;
        mainTitle: string;
        date: string;
        level: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            tasks: import("src/modules/task/entity/task.entity").Task[];
            total: number;
        };
    } | {
        code: number;
        msg: string;
        data: {};
    }>;
    getTaskById(data: {
        id: number;
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: import("src/modules/task/entity/task.entity").Task;
    } | {
        code: number;
        msg: string;
        data: {};
    }>;
    deleteTask(data: {
        id: number;
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    uploadFile(file: Express.Multer.File, data: {
        userId: number;
        type: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {};
    }>;
    exportDaily(data: {
        userId: number;
        date: string;
    }, response: Response): Promise<any>;
    sendDailyEmail(data: {
        userId: number;
        hisId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    exportMonthly(data: {
        userId: number;
        startDate: string;
        endDate: string;
    }, response: Response): Promise<void>;
    getHistoryList(data: {
        userId: number;
        page: number;
        type: number;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            list: import("src/modules/task/entity/taskHistory").TaskHistory[];
            total: number;
        };
    } | {
        code: number;
        msg: string;
        data: {};
    }>;
    deleteHistoryFile(data: {
        id: number;
        userId: number;
    }): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    downloadHistoryFile(response: Response, data: {
        userId: number;
        hisId: any;
    }): Promise<void>;
    downloadTemplate(response: Response, data: {
        userId: number;
        type: number;
    }): Promise<void>;
    getTaskByMonth(data: {
        userId: number;
        year: string;
        month: string;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            TaskLIst_estimate: any[];
            TaskLIst_actual: any[];
        };
    } | {
        code: number;
        msg: string;
        data: {};
    }>;
    getHoildayByMonth(data: {
        userId: number;
        year: string;
        month: string;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            holidayData: any;
        };
    } | {
        code: number;
        msg: string;
        data: {};
    }>;
}
