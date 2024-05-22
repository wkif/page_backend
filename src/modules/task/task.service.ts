import { Injectable } from '@nestjs/common';
import { Task } from './entity/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { OssService } from '../oss/oss.service';
import * as nodemailer from 'nodemailer';
import readTemplate from 'src/utils/readTemplate';
import writeTemplate from 'src/utils/writeTemplate';
import createEmailText from 'src/utils/emailText';
import { TaskHistory } from './entity/taskHistory';
import creatFileHash from 'src/utils/createHash';
import { format } from 'date-fns';
import { HttpService } from '@nestjs/axios';
import bufferToStream from 'src/utils/bufferToStream';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private task: Repository<Task>,
    @InjectRepository(TaskHistory) private taskHistory: Repository<TaskHistory>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly ossService: OssService,
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
    if (!level) {
      delete where.level;
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
    const filePath = 'uploads/' + user.id.toString() + '/' + user.dailyTemplate;
    const isExist = this.ossService.existObject(filePath);
    if (!isExist) {
      return {
        code: 500,
        msg: '日报模板文件丢失，请重新上传',
        data: null,
      };
    }
    let url = await this.ossService.getFileSignatureUrl(filePath);
    if (!url) {
      return {
        code: 500,
        msg: '日报模板文件丢失，请重新上传',
        data: null,
      };
    }
    if (!url.includes('https')) {
      url = url.replace('http', 'https');
    }
    const templateData = await readTemplate(url);
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
    const saveBuffer = await writeTemplate(url, tasks, templateData);
    const path = 'cache/' + user.id.toString() + '/' + fileName;
    const isExist_1 = await this.ossService.existObject(path);
    if (isExist_1) {
      await this.ossService.deleteOne(path);
    }
    const streams = bufferToStream(saveBuffer);
    const fileurl = await this.ossService.putStream(streams, path);
    if (fileurl) {
      const his = await this.addTaskReportHistory(
        userId,
        fileName,
        fileurl,
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
    const path = 'cache/' + userId.toString() + '/' + history.fileName;
    const isExist = await this.ossService.existObject(path);
    if (!isExist) {
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
    const url = await this.ossService.getFileSignatureUrl(path);
    const htmlTable = await createEmailText(url);
    const info = await transporter.sendMail({
      from: user.emailSend,
      to: user.emailReceiver,
      subject: history.fileName,
      html: htmlTable,
      attachments: [
        {
          filename: history.fileName,
          path: url,
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

    const filePath =
      'uploads/' + user.id.toString() + '/' + user.monthlyTemplate;
    const isExist = this.ossService.existObject(filePath);
    if (!isExist) {
      return {
        code: 500,
        msg: '月报模板文件丢失，请重新上传',
        data: null,
      };
    }
    let url = await this.ossService.getFileSignatureUrl(filePath);
    if (!url) {
      return {
        code: 500,
        msg: '月报模板文件丢失，请重新上传',
        data: null,
      };
    }
    if (!url.includes('https')) {
      url = url.replace('http', 'https');
    }
    const templateData = await readTemplate(url);
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
    const saveBuffer = await writeTemplate(url, tasks, templateData);
    const path = 'cache/' + user.id.toString() + '/' + fileName;
    const isExist_1 = await this.ossService.existObject(path);
    if (isExist_1) {
      await this.ossService.deleteOne(path);
    }
    const streams = bufferToStream(saveBuffer);
    const fileurl = await this.ossService.putStream(streams, path);
    if (fileurl) {
      const his = await this.addTaskReportHistory(
        userId,
        fileName,
        fileurl,
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
    url,
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
    const hash = await creatFileHash(url);
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
    const filePath = 'cache/' + userId.toString() + '/' + history.fileName;
    const isExist = await this.ossService.existObject(filePath);
    if (!isExist) {
      return {
        code: 500,
        msg: '文件不存在',
        data: null,
      };
    }
    await this.ossService.deleteOne(filePath);
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
      url: string;
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
    console.log('history', history);
    if (!history) {
      return {
        code: 500,
        msg: '文件不存在',
        data: null,
      };
    }
    const isExist = await this.ossService.existObject(
      'cache/' + userId.toString() + '/' + history.fileName,
    );
    if (!isExist) {
      return {
        code: 500,
        msg: '文件不存在',
        data: null,
      };
    }
    const url = await this.ossService.getFileSignatureUrl(
      'cache/' + user.id.toString() + '/' + history.fileName,
    );
    console.log('url', url);
    return {
      code: 200,
      msg: 'ok',
      data: {
        url,
        fileName: history.fileName,
      },
    };
  }
  async getTaskByMonth_e(userId, year, month) {
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
    const startDate = `${year}-${month < 10 ? '0' + month : month}-01`;
    const endDate = `${year}-${month < 10 ? '0' + month : month}-${days}`;
    const where = {
      user: {
        id: userId,
      },
      estimatedStartDate: Between(startDate, endDate),
      estimatedEndDate: Between(startDate, endDate),
    };
    const taskList = await this.task.find({
      where,
    });
    for (let i = 1; i <= days; i++) {
      const day = i < 10 ? '0' + i : i;
      const date = `${year}-${month < 10 ? '0' + month : month}-${day}`;
      const tasks = taskList.filter((item) => {
        return item.estimatedStartDate <= date && item.estimatedEndDate >= date;
      });
      TaskLIst_estimate.push({
        day: i,
        date,
        tasks,
      });
    }
    return {
      code: 200,
      msg: 'ok',
      data: TaskLIst_estimate,
    };
  }
  async getTaskByMonth_a(userId, year, month) {
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
    const TaskLIst_actual = [];
    const startDate = `${year}-${month < 10 ? '0' + month : month}-01`;
    const endDate = `${year}-${month < 10 ? '0' + month : month}-${days}`;
    const where = {
      user: {
        id: userId,
      },
      actualStartDate: Between(startDate, endDate),
      actualEndDate: Between(startDate, endDate),
    };
    const taskList = await this.task.find({
      where,
    });
    for (let i = 1; i <= days; i++) {
      const day = i < 10 ? '0' + i : i;
      const date = `${year}-${month < 10 ? '0' + month : month}-${day}`;
      const tasks = taskList.filter((item) => {
        return item.actualStartDate <= date && item.actualEndDate >= date;
      });
      TaskLIst_actual.push({
        day: i,
        date,
        tasks,
      });
    }
    return {
      code: 200,
      msg: 'ok',
      data: TaskLIst_actual,
    };
  }
  async getHoildayByMonth(userId, year, month) {
    const user = await this.userService.getUserByid(userId);
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
        data: null,
      };
    }
    const date = `${year}-${month < 10 ? '0' + month : month}`;
    const HolidayData = await this.httpService
      .get(`https://api.haoshenqi.top/holiday?date=${date}`)
      .toPromise()
      .then((res) => res.data)
      .catch((e) => {
        throw new Error('internal communication error' + e);
      });
    //  status: 0普通工作日1周末双休日2需要补班的工作日3法定节假日
    return {
      code: 200,
      msg: 'ok',
      data: {
        holidayData: HolidayData,
      },
    };
  }
}
