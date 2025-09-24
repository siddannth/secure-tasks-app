import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { AccessGuard } from '@securetasks/auth';


@Module({
  imports: [TypeOrmModule.forFeature([Task, Organization, User])],
  controllers: [TasksController],
  providers: [TasksService , AccessGuard],
})
export class TasksModule {}
