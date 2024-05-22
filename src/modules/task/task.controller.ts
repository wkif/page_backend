import { Body, Controller, Post, Res } from '@nestjs/common';
import * as fs from 'fs';
import { Response } from 'express';
import { Readable } from 'stream';

import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { AppService } from 'src/app.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly appService: AppService,
  ) {}

  // 新增任务
  @Post('addTask')
  async addTask(
    @Body()
    data: {
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
    },
  ) {
    const {
      userId,
      title,
      mainTitle,
      date,
      arranger,
      estimatedWorkingHours,
      estimatedStartDate,
      estimatedEndDate,
      actualWorkingHours,
      actualStartDate,
      actualEndDate,
      status,
      progress,
      remarks,
      level,
    } = data;
    if (
      !userId ||
      !title ||
      !mainTitle ||
      !date ||
      !arranger ||
      !estimatedWorkingHours ||
      !estimatedStartDate ||
      !estimatedEndDate ||
      !status ||
      !progress ||
      !level
    ) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.addTask(
      userId,
      title,
      mainTitle,
      date,
      arranger,
      estimatedWorkingHours,
      estimatedStartDate,
      estimatedEndDate,
      actualWorkingHours,
      actualStartDate,
      actualEndDate,
      status,
      progress,
      remarks,
      level,
    );
  }

  // 编辑任务
  @Post('editTask')
  async editTask(
    @Body()
    data: {
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
    },
  ) {
    const {
      id,
      userId,
      title,
      mainTitle,
      date,
      arranger,
      estimatedWorkingHours,
      estimatedStartDate,
      estimatedEndDate,
      actualWorkingHours,
      actualStartDate,
      actualEndDate,
      status,
      progress,
      remarks,
      level,
    } = data;
    if (
      !id ||
      !userId ||
      !title ||
      !mainTitle ||
      !date ||
      !arranger ||
      !estimatedWorkingHours ||
      !estimatedStartDate ||
      !estimatedEndDate ||
      !status ||
      !progress ||
      !level
    ) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    return await this.taskService.editTask(
      id,
      userId,
      title,
      mainTitle,
      date,
      arranger,
      estimatedWorkingHours,
      estimatedStartDate,
      estimatedEndDate,
      actualWorkingHours,
      actualStartDate,
      actualEndDate,
      status,
      progress,
      remarks,
      level,
    );
  }

  // 获取任务
  @Post('getTaskList')
  async getTaskList(
    @Body()
    data: {
      userId: number;
      page: number;
      status: string;
      title: string;
      mainTitle: string;
      date: string;
      level: number;
    },
  ) {
    const { userId, page, status, title, mainTitle, date, level } = data;
    if (!userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.getTaskList(
      userId,
      page,
      status,
      title,
      mainTitle,
      date,
      level,
    );
  }

  // 获取任务详情
  @Post('getTaskById')
  async getTaskById(@Body() data: { id: number; userId: number }) {
    const { id, userId } = data;
    if (!id || !userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.getTaskById(id, userId);
  }

  // 删除任务
  @Post('deleteTask')
  async deleteTask(@Body() data: { id: number; userId: number }) {
    const { id, userId } = data;
    if (!id || !userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.deleteTask(id, userId);
  }

  // 导出日报
  @Post('exportDaily')
  async exportDaily(
    @Body() data: { userId: number; date: string },
    @Res() response: Response,
  ): Promise<any> {
    const { userId, date } = data;
    if (!userId || !date) {
      response.send({
        code: 500,
        msg: '请完整填写信息',
        data: null,
      });
      return;
    }
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      response.send({
        code: 500,
        msg: '用户不存在',
        data: null,
      });
      return;
    }
    const defaultFileName = `[[userid]]_[[username]]_[[email]]_[[date]].xlsx`;

    const dailyTemplateName = user.dailyTemplateName
      ? user.dailyTemplateName
      : defaultFileName;
    const fileName = dailyTemplateName
      .replace('[[userid]]', user.id.toString())
      .replace('[[username]]', user.username)
      .replace('[[date]]', date)
      .replace('[[email]]', user.email);
    const res = await this.taskService.exportDaily(userId, date, fileName);
    if (res.code == 200) {
      response.send({
        code: 200,
        msg: '成功',
        data: {
          hisId: res.data,
        },
      });
      return;
    } else {
      response.send({
        code: 500,
        msg: res.msg,
        data: null,
      });
      return;
    }
  }

  // 发送日报邮件
  @Post('sendDailyEmail')
  async sendDailyEmail(@Body() data: { userId: number; hisId: number }) {
    const { userId, hisId } = data;
    if (!userId || !hisId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: null,
      };
    }
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    return await this.taskService.sendDailyEmail(userId, hisId);
  }

  // 导出月报
  @Post('exportMonthly')
  async exportMonthly(
    @Body() data: { userId: number; startDate: string; endDate: string },
    @Res() response: Response,
  ) {
    const { userId, startDate, endDate } = data;
    if (!userId || !startDate || !endDate) {
      response.send({
        code: 500,
        msg: '请完整填写信息',
        data: null,
      });
      return;
    }
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      response.send({
        code: 500,
        msg: '用户不存在',
        data: null,
      });
      return;
    }
    const defaultFileName = `[[userid]]_[[username]]_[[email]]_[[startDate]]_[[endDate]].xlsx`;
    const monthlyTemplateName = user.monthlyTemplateName
      ? user.monthlyTemplateName
      : defaultFileName;
    const fileName = monthlyTemplateName
      .replace('[[userid]]', user.id.toString())
      .replace('[[username]]', user.username)
      .replace('[[email]]', user.email)
      .replace('[[startDate]]', startDate)
      .replace('[[endDate]]', endDate);

    const res = await this.taskService.exportMonthly(
      userId,
      startDate,
      endDate,
      fileName,
    );
    if (res.code == 200) {
      response.send({
        code: 200,
        msg: '成功',
        data: res.data,
      });
      return;
    } else {
      response.send({
        code: 500,
        msg: res.msg,
        data: null,
      });
      return;
    }
  }

  @Post('getHistoryList')
  async getHistoryList(
    @Body() data: { userId: number; page: number; type: number },
  ) {
    const { userId, page, type } = data;
    if (!userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.getHistoryList(userId, page, type);
  }
  @Post('deleteHistoryFile')
  async deleteHistoryFile(@Body() data: { hisId: number; userId: number }) {
    const { hisId, userId } = data;
    if (!hisId || !userId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.deleteHistoryFile(hisId, userId);
  }

  @Post('downloadHistoryFile')
  async downloadHistoryFile(@Body() data: { userId: number; hisId: number }) {
    console.log('data', data);
    const { userId, hisId } = data;
    if (!userId || !hisId) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: null,
      };
    }
    return await this.taskService.downloadHistoryFile(userId, hisId);
  }

  @Post('downloadTemplate')
  async downloadTemplate(
    @Res() response: Response,
    @Body() data: { userId: number; type: number },
  ) {
    const { userId, type } = data;
    if (!userId || !type) {
      response.send({
        code: 500,
        msg: '请完整填写信息',
        data: null,
      });
      return;
    }
    const filePath = await this.userService.getTemplate(userId, type);
    if (!filePath) {
      response.send({
        code: 500,
        msg: '模板不存在',
        data: null,
      });
      return;
    }
    const buffer = fs.readFileSync(filePath);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Length': buffer.length,
      'Content-disposition': `attachment; filename=${encodeURIComponent(filePath)}`,
    });
    stream.pipe(response);
  }

  @Post('getEstimateTaskByMonth')
  async getEstimateTaskByMonth(
    @Body() data: { userId: number; year: string; month: string },
  ) {
    const { userId, year, month } = data;
    if (!userId || !year || !month) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.getTaskByMonth_e(userId, year, month);
  }

  @Post('getActualTaskByMonth')
  async getActualTaskByMonth(
    @Body() data: { userId: number; year: string; month: string },
  ) {
    const { userId, year, month } = data;
    if (!userId || !year || !month) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.getTaskByMonth_e(userId, year, month);
  }

  @Post('getHoildayByMonth')
  async getHoildayByMonth(
    @Body() data: { userId: number; year: string; month: string },
  ) {
    const { userId, year, month } = data;
    if (!userId || !year || !month) {
      return {
        code: 500,
        msg: '请完整填写信息',
        data: {},
      };
    }
    return await this.taskService.getHoildayByMonth(userId, year, month);
  }
}
