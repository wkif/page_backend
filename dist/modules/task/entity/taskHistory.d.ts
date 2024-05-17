import { User } from 'src/modules/user/entity/user.entity';
export declare class TaskHistory {
    id: number;
    user: User;
    createTime: string;
    fileName: string;
    fileHash: string;
    fileExist: boolean;
    reportType: number;
    hasSendEmail: boolean;
    reportDate: string;
    reportDateStart: string;
    reportDateEnd: string;
}
