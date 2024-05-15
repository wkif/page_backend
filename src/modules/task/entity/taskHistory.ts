import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/modules/user/entity/user.entity';

@Entity()
export class TaskHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.taskhistory)
  user: User;
  @Column()
  createTime: string;
  @Column()
  fileName: string;
  @Column()
  fileHash: string;
  @Column()
  fileExist: boolean;
  @Column()
  reportType: number;
  @Column()
  hasSendEmail: boolean;
  @Column()
  reportDate: string;
  @Column()
  reportDateStart: string;
  @Column()
  reportDateEnd: string;
}
