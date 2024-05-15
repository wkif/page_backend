import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/modules/user/entity/user.entity';
import { Category } from './category.entity';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.links)
  user: User;
  @Column()
  title: string;
  @Column()
  url: string;
  @Column()
  description: string;
  @ManyToOne(() => Category, (category) => category.links)
  @JoinColumn()
  category: Category;
  @Column()
  tags: string;
  @Column()
  github: string;
}
