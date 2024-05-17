import { User } from 'src/modules/user/entity/user.entity';
export declare class Task {
    id: number;
    user: User;
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
}
