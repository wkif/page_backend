import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Link } from 'src/modules/links/entity/link.entity';
import { Task } from 'src/modules/task/entity/task.entity';
import { TaskHistory } from 'src/modules/task/entity/taskHistory';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  username: string;
  @Column()
  avatar: string;
  @Column()
  password: string;
  @Column()
  passwdSalt: string;
  @Column()
  isactive: boolean;
  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
  @OneToMany(() => Task, (task) => task.user)
  task: Task[];
  @OneToMany(() => TaskHistory, (taskhistory) => taskhistory.user)
  taskhistory: TaskHistory[];
  @Column({
    default: '',
  })
  dailyTemplate: string;
  @Column({
    default: '',
  })
  dailyTemplateName: string;
  @Column({
    default: '',
  })
  monthlyTemplate: string;
  @Column({
    default: '',
  })
  monthlyTemplateName: string;
  // 邮件发送邮箱
  @Column({
    default: '',
  })
  emailSend: string;
  // 邮箱HOST
  @Column({
    default: '',
  })
  emailHost: string;
  // 邮箱端口
  @Column({
    default: '',
  })
  emailPort: string;
  // 邮箱授权码
  @Column({
    default: '',
  })
  emailAuth: string;
  // 收件人邮箱
  @Column({
    default: '',
  })
  emailReceiver: string;
  @Column({
    default: '',
  })
  newsTypes: string;
}
