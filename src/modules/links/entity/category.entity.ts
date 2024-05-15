import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Link } from './link.entity';
import { User } from 'src/modules/user/entity/user.entity';
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.links)
  user: User;
  @OneToMany(() => Link, (link) => link.category)
  links: Link[];
  @Column()
  typename: string;
}
