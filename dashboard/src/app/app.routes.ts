// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TaskListComponent } from './tasks/task-list.component';
import { AuditComponent } from './audit/audit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'audit', component: AuditComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
