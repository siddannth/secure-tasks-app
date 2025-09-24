
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto } from './dto';
import { TaskStatus } from '../../../../libs/data/src/lib/task.types';
import { Role } from '@securetasks/data';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasks: Repository<Task>,
    @InjectRepository(Organization) private orgs: Repository<Organization>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto, actor: { sub: string; orgId: string }) {
    const org = await this.orgs.findOneByOrFail({ id: actor.orgId });
    const user = await this.users.findOneByOrFail({ id: actor.sub });

    const task = this.tasks.create({
      title: dto.title,
      description: dto.description,
      category: dto.category || 'General',
      status: dto.status || TaskStatus.TODO,
      org,
      createdBy: user,
    });

    return this.tasks.save(task);
  }

  async findAllScoped(actor: { orgId: string; role: Role }, q: QueryTaskDto) {
    const where: any = {};

    
    if (actor.role !== Role.OWNER) {
      where.org = { id: actor.orgId };
    }

    if (q.category) where.category = q.category;
    if (q.status) where.status = q.status;
    if (q.search) where.title = ILike(`%${q.search}%`);

    return this.tasks.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    const t = await this.tasks.findOne({ where: { id } });
    if (!t) throw new NotFoundException();
    Object.assign(t, dto);
    return this.tasks.save(t);
  }

  async remove(id: string) {
    const t = await this.tasks.findOne({ where: { id } });
    if (!t) throw new NotFoundException();
    await this.tasks.remove(t);
    return { ok: true };
  }
}
