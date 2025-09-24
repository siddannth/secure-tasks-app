import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles, OrgScoped } from '@securetasks/auth';
import { Role } from '@securetasks/data';

@UseGuards(JwtAuthGuard)
@Controller('audit-log')
export class AuditController {
  @Get()
  @Roles(Role.ADMIN, Role.OWNER)
  getLog() {
    return { message: 'Audit logs are printed to server console.' };
  }
}
