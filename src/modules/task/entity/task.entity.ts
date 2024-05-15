import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/modules/user/entity/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.task)
  user: User;
  @Column()
  title: string;
  @Column()
  mainTitle: string;
  @Column({
    type: 'date',
    nullable: true,
  })
  date: string;
  @Column()
  arranger: string;
  @Column()
  estimatedWorkingHours: number;
  @Column({
    type: 'date',
  })
  estimatedStartDate: string;
  @Column({
    type: 'date',
  })
  estimatedEndDate: string;
  @Column()
  actualWorkingHours: number;
  @Column({
    type: 'date',
  })
  actualStartDate: string;
  @Column({
    type: 'date',
  })
  actualEndDate: string;
  @Column()
  status: string;
  @Column()
  progress: number;
  @Column()
  remarks: string;
  @Column()
  level: number;
}
