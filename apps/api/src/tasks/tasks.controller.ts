import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AccessGuard } from '@securetasks/auth';

import { Roles, OrgScoped } from '@securetasks/auth';
import { Role } from '@securetasks/data';

@UseGuards(JwtAuthGuard, AccessGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OWNER) @OrgScoped()
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.svc.create(dto, req.user);
  }

  @Get()
  @OrgScoped()
  findAll(@Req() req: any, @Query() q: QueryTaskDto) {
    return this.svc.findAllScoped(req.user, q);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.OWNER) @OrgScoped()
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER) @OrgScoped()
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
