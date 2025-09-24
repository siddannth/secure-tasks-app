import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // 👇 THIS is what user.entity.ts is pointing to (org.users)
  @OneToMany(() => User, (user) => user.org)
  users: User[];

  @OneToMany(() => Task, (task) => task.org)
  tasks: Task[];
}
