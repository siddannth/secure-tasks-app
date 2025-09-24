import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent {
  title = '';
  description = '';
  category = 'General';
  status = 'Pending';

  @Output() created = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  submit() {
    this.taskService.createTask({
      title: this.title,
      description: this.description,
      category: this.category,
      status: this.status
    }).subscribe(() => {
      this.created.emit();
      this.title = '';
      this.description = '';
      this.category = 'General';
      this.status = 'Pending';
    });
  }
}
