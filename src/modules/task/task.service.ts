import { Injectable } from '@nestjs/common';
import { Task } from './entity/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UserService } from '../user/user.service';
import * as path from 'path';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import config from 'src/config/index';
import readTemplate from 'src/utils/readTemplate';
import writeTemplate from 'src/utils/writeTemplate';
import createEmailText from 'src/utils/emailText';
import { TaskHistory } from './entity/taskHistory';
import creatFileHash from 'src/utils/createHash';
import { format } from 'date-fns';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private task: Repository<Task>,
    @InjectRepository(TaskHistory) private taskHistory: Repository<TaskHistory>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  async getTaskById(id, userId) {
    const task = await this.task.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });
    return {
      code: 200,
      msg: 'ok',
      data: task,
    };
  }

  async addTask(
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
  ) {
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    const task = new Task();
    task.user = user;
    task.title = title;
    task.mainTitle = mainTitle;
    task.date = date;
    task.arranger = arranger;
    task.estimatedWorkingHours = estimatedWorkingHours;
    task.estimatedStartDate = estimatedStartDate;
    task.estimatedEndDate = estimatedEndDate;
    task.actualWorkingHours = actualWorkingHours;
    task.actualStartDate = actualStartDate;
    task.actualEndDate = actualEndDate;
    task.status = status;
    task.progress = progress;
    task.remarks = remarks;
    task.level = level;
    await this.task.save(task);
    return {
      code: 200,
      msg: 'ok',
      data: {},
    };
  }

  async editTask(
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
  ) {
    const task = await this.task.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });
    if (!task) {
      return {
        code: 500,
        msg: '任务不存在',
        data: null,
      };
    }

    task.title = title;
    task.mainTitle = mainTitle;
    task.date = date;
    task.arranger = arranger;
    task.estimatedWorkingHours = estimatedWorkingHours;
    task.estimatedStartDate = estimatedStartDate;
    task.estimatedEndDate = estimatedEndDate;
    task.actualWorkingHours = actualWorkingHours;
    task.actualStartDate = actualStartDate;
    task.actualEndDate = actualEndDate;
    task.status = status;
    task.progress = progress;
    task.remarks = remarks;
    task.level = level;

    await this.task.save(task);
    return {
      code: 200,
      msg: 'ok',
      data: {},
    };
  }
  async getTaskList(userId, page, status, title, mainTitle, date, level) {
    const where = {
      user: { id: userId },
      title: Like(`%${title}%`),
      mainTitle: Like(`%${mainTitle}%`),
      status: Like(`%${status}%`),
      date: date,
      level: level,
    };
    if (!title) {
      delete where.title;
    }
    if (!mainTitle) {
      delete where.mainTitle;
    }
    if (!status) {
      delete where.status;
    }
    if (!date) {
      delete where.date;
    }
    const tasks = await this.task.find({
      where: where,
      skip: (page - 1) * 10,
      take: 10,
      order: { id: 'DESC' },
    });
    const total = await this.task.count({
      where,
    });
    return {
      code: 200,
      msg: 'ok',
      data: {
        tasks,
        total,
      },
    };
  }
  async deleteTask(id, userId) {
    const task = await this.task.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });
    if (!task) {
      return {
        code: 500,
        msg: '任务不存在',
        data: null,
      };
    }
    await this.task.remove(task);
    return {
      code: 200,
      msg: 'ok',
      data: {},
    };
  }
  async exportDaily(userId, date, fileName) {
    const user = await this.userService.getUserByid(userId);
    if (!user.dailyTemplate) {
      return {
        code: 500,
        msg: '请先设置日报模板',
        data: null,
      };
    }
    const filePath = path.resolve(config().uploadsPath, user.dailyTemplate);
    if (!fs.existsSync(filePath)) {
      return {
        code: 500,
        msg: '日报模板文件丢失，请重新上传',
        data: null,
      };
    }
    const templateData = await readTemplate(filePath);
    // 不存在 config().cachePath路径则创建
    if (!fs.existsSync(config().cachePath)) {
      fs.mkdirSync(config().cachePath);
    }
    const cachePath = path.resolve(config().cachePath, fileName);
    fs.copyFile(filePath, cachePath, (err) => {
      if (err) {
        return {
          code: 500,
          msg: '日报模板文件丢失，请重新上传',
          data: null,
        };
      }
    });
    const tasks = await this.task.find({
      where: {
        user: {
          id: userId,
        },
        date: date,
      },
    });
    tasks.forEach((item, index) => {
      item['username'] = user.username;
      item['fullTitle'] = item['mainTitle'] + '-' + item['title'];
      item['no'] = index + 1;
    });
    if (!tasks || tasks.length === 0) {
      return {
        code: 500,
        msg: '数据为空',
        data: null,
      };
    }
    const res = await writeTemplate(cachePath, tasks, templateData);
    if (res) {
      const his = await this.addTaskReportHistory(
        userId,
        fileName,
        1,
        false,
        date,
      );
      return {
        code: 200,
        msg: 'ok',
        data: his.data,
      };
    } else {
      return {
        code: 500,
        msg: '日报生成失败',
        data: null,
      };
    }
  }

  async sendDailyEmail(userId, hisId) {
    const history = await this.taskHistory.findOne({
      where: {
        id: hisId,
        user: {
          id: userId,
        },
      },
    });
    if (!history) {
      return {
        code: 500,
        msg: '无日报记录',
        data: null,
      };
    }
    const filePath = path.resolve(config().cachePath, history.fileName);
    if (!fs.existsSync(filePath)) {
      return {
        code: 500,
        msg: '无当日日报文件，请重新生成',
        data: null,
      };
    }
    const user = await this.userService.getUserByid(userId);
    const transporter = nodemailer.createTransport({
      host: user.emailHost,
      port: user.emailPort,
      secure: true,
      auth: {
        user: user.emailSend,
        pass: user.emailAuth,
      },
    });
    const htmlTable = createEmailText(filePath);
    const info = await transporter.sendMail({
      from: user.emailSend,
      to: user.emailReceiver,
      subject: history.fileName,
      html: htmlTable,
      attachments: [
        {
          filename: history.fileName,
          path: filePath,
        },
      ],
    });
    if (info.response.includes('Ok')) {
      history.hasSendEmail = true;
      await this.taskHistory.save(history);
      return {
        code: 200,
        msg: 'ok',
        data: null,
      };
    } else {
      return {
        code: 500,
        msg: '邮件发送失败',
        data: null,
      };
    }
  }

  async exportMonthly(userId, startDate, endDate, fileName) {
    const user = await this.userService.getUserByid(userId);
    if (!user.monthlyTemplate) {
      return {
        code: 500,
        msg: '请先设置月报模板',
        data: null,
      };
    }
    const filePath = path.resolve(config().uploadsPath, user.monthlyTemplate);
    if (!fs.existsSync(filePath)) {
      return {
        code: 500,
        msg: '月报模板文件丢失，请重新上传',
        data: null,
      };
    }
    const templateData = await readTemplate(filePath);
    // 不存在 config().cachePath路径则创建
    if (!fs.existsSync(config().cachePath)) {
      fs.mkdirSync(config().cachePath);
    }
    const cachePath = path.resolve(config().cachePath, fileName);
    fs.copyFile(filePath, cachePath, (err) => {
      if (err) {
        return {
          code: 500,
          msg: '日报模板文件丢失，请重新上传',
          data: null,
        };
      }
    });
    const tasks = await this.task.find({
      where: {
        user: {
          id: userId,
        },
        date: Between(startDate, endDate),
      },
    });
    if (!tasks || tasks.length === 0) {
      return {
        code: 500,
        msg: '数据为空',
        data: null,
      };
    }
    tasks.forEach((item, index) => {
      item['no'] = index + 1;
      item['fullTitle'] = item['mainTitle'] + '-' + item['title'];
    });
    const res = await writeTemplate(cachePath, tasks, templateData);
    if (res) {
      const his = await this.addTaskReportHistory(
        userId,
        fileName,
        2,
        false,
        null,
        startDate,
        endDate,
      );
      return {
        code: 200,
        msg: 'ok',
        data: his.data,
      };
    } else {
      return {
        code: 500,
        msg: '月报生成失败',
        data: null,
      };
    }
  }

  async addTaskReportHistory(
    userId,
    filename,
    reportType,
    hasSendEmail,
    reportDate = null,
    reportDateStart = null,
    reportDateEnd = null,
  ) {
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    const history = new TaskHistory();
    history.user = user;
    history.createTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    history.fileName = filename;
    history.fileExist = true;
    history.reportType = reportType;
    history.hasSendEmail = hasSendEmail;
    if (reportDate) {
      history.reportDate = reportDate;
    } else {
      history.reportDate = '';
    }
    if (reportDateStart) {
      history.reportDateStart = reportDateStart;
    } else {
      history.reportDateStart = '';
    }
    if (reportDateEnd) {
      history.reportDateEnd = reportDateEnd;
    } else {
      history.reportDateEnd = '';
    }
    const hash = creatFileHash(path.resolve(config().cachePath, filename));
    if (hash.code === 1) {
      history.fileHash = hash.data;
    } else {
      history.fileHash = '';
    }
    await this.taskHistory.save(history);
    return {
      code: 200,
      msg: 'ok',
      data: history.id,
    };
  }
  async getHistoryList(userId, page, type) {
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    const where = {
      user: {
        id: userId,
      },
      reportType: type,
    };
    const historyList = await this.taskHistory.find({
      where,
      skip: (page - 1) * 10,
      take: 10,
      order: { id: 'DESC' },
    });
    const total = await this.taskHistory.count({
      where,
    });
    return {
      code: 200,
      msg: 'ok',
      data: {
        list: historyList,
        total: total,
      },
    };
  }
  async deleteHistoryFile(hisId, userId) {
    const history = await this.taskHistory.findOne({
      where: {
        id: hisId,
        user: {
          id: userId,
        },
      },
    });
    if (!history) {
      return {
        code: 500,
        msg: '文件不存在',
        data: null,
      };
    }

    const filePath = path.resolve(config().cachePath, history.fileName);
    if (!fs.existsSync(filePath)) {
      return {
        code: 500,
        msg: '文件不存在',
        data: null,
      };
    }

    fs.unlinkSync(filePath);
    history.fileExist = false;
    await this.taskHistory.save(history);
    return {
      code: 200,
      msg: 'ok',
      data: null,
    };
  }
  async downloadHistoryFile(
    userId,
    hisId,
  ): Promise<{
    code: number;
    msg: string;
    data: {
      filePath: string;
      fileName: string;
    };
  }> {
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    const history = await this.taskHistory.findOne({
      where: {
        id: hisId,
        user: {
          id: userId,
        },
        fileExist: true,
      },
    });
    if (!history) {
      return {
        code: 500,
        msg: '文件不存在',
        data: null,
      };
    }
    return {
      code: 200,
      msg: 'ok',
      data: {
        filePath: path.resolve(config().cachePath, history.fileName),
        fileName: history.fileName,
      },
    };
  }
  async getTaskByMonth(userId, year, month) {
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    // 当前月份的所有天数
    const days = new Date(year, month, 0).getDate();
    const TaskLIst_estimate = [];
    const TaskLIst_actual = [];
    const HolidayData = await this.getHolidayData(
      `${year}-${month < 10 ? '0' + month : month}`,
    );
    for (let i = 1; i <= days; i++) {
      const day = i < 10 ? '0' + i : i;
      const date = `${year}-${month < 10 ? '0' + month : month}-${day}`;
      const where = {
        user: {
          id: userId,
        },
        estimatedStartDate: LessThanOrEqual(date),
        estimatedEndDate: MoreThanOrEqual(date),
      };
      const task = await this.task.findOne({
        where,
      });
      TaskLIst_estimate.push({
        day: i,
        date,
        task,
      });
      const where2 = {
        user: {
          id: userId,
        },
        actualStartDate: LessThanOrEqual(date),
        actualEndDate: MoreThanOrEqual(date),
      };
      const task2 = await this.task.findOne({
        where: where2,
      });
      TaskLIst_actual.push({
        day: i,
        date,
        task: task2,
      });
    }
    return {
      code: 200,
      msg: 'ok',
      data: {
        holidayData: HolidayData,
        TaskLIst_estimate,
        TaskLIst_actual,
      },
    };
  }

  async getHolidayData(date) {
    const res = await this.httpService
      .get(`https://api.haoshenqi.top/holiday?date=${date}`)
      .toPromise()
      .then((res) => res.data);
    //  status: 0普通工作日1周末双休日2需要补班的工作日3法定节假日
    return res;
  }
}
