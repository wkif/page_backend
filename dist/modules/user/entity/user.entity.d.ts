import { Link } from 'src/modules/links/entity/link.entity';
import { Task } from 'src/modules/task/entity/task.entity';
import { TaskHistory } from 'src/modules/task/entity/taskHistory';
export declare class User {
    id: number;
    email: string;
    username: string;
    avatar: string;
    password: string;
    passwdSalt: string;
    isactive: boolean;
    links: Link[];
    task: Task[];
    taskhistory: TaskHistory[];
    dailyTemplate: string;
    dailyTemplateName: string;
    monthlyTemplate: string;
    monthlyTemplateName: string;
    emailSend: string;
    emailHost: string;
    emailPort: string;
    emailAuth: string;
    emailReceiver: string;
}
