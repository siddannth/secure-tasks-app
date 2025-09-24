import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { TaskService } from './task.service';
import { TaskFormComponent } from './task-form.component';
import { CompletionChartComponent } from '../charts/completion-chart.component';

type Task = {
  id: string;
  title: string;
  description?: string;
  category: 'Work' | 'Personal' | string;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
};

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TaskFormComponent, CompletionChartComponent],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  private allTasks = signal<Task[]>([]);

  search = signal<string>('');
  filterCategory = signal<string>('');
  filterStatus = signal<string>('');
  sortField = signal<'createdAt' | 'title' | 'status'>('createdAt');

  todo = signal<Task[]>([]);
  inProgress = signal<Task[]>([]);
  done = signal<Task[]>([]);

  tasksForChart = computed(() => [
    ...this.todo(), ...this.inProgress(), ...this.done()
  ]);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  private applyFiltersAndSort(tasks: Task[]): Task[] {
    const s = this.search().trim().toLowerCase();
    const cat = this.filterCategory();
    const st = this.filterStatus();
    const sorted = [...tasks]
      .filter(t => (s ? (t.title.toLowerCase().includes(s) || (t.description || '').toLowerCase().includes(s)) : true))
      .filter(t => (cat ? t.category === cat : true))
      .filter(t => (st ? t.status === st : true))
      .sort((a, b) => {
        const field = this.sortField();
        if (field === 'title') return a.title.localeCompare(b.title);
        if (field === 'status') return a.status.localeCompare(b.status);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    return sorted;
  }

  private refillLanes() {
    const filtered = this.applyFiltersAndSort(this.allTasks());
    this.todo.set(filtered.filter(t => t.status === 'todo'));
    this.inProgress.set(filtered.filter(t => t.status === 'in_progress'));
    this.done.set(filtered.filter(t => t.status === 'done'));
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.allTasks.set(data);
      this.refillLanes();
    });
  }

  onCreated() {
    this.loadTasks();
  }

  onDelete(id: string) {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }

  // --- Edit handling ---
  editingId: string | null = null;
  editBuffer: { title?: string; description?: string; category?: string; status?: string } = {};

  startEdit(task: Task) {
    this.editingId = task.id;
    this.editBuffer = {
      title: task.title,
      description: task.description,
      category: task.category,
      status: task.status
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.editBuffer = {};
  }

  saveEdit(id: string) {
    const payload = { ...this.editBuffer };
    this.taskService.updateTask(id, payload).subscribe(() => {
      this.cancelEdit();
      this.loadTasks();
    });
  }

  // Drag & Drop
  dropTodo(event: CdkDragDrop<Task[]>) { this.handleDrop(event, 'todo'); }
  dropDoing(event: CdkDragDrop<Task[]>) { this.handleDrop(event, 'in_progress'); }
  dropDone(event: CdkDragDrop<Task[]>) { this.handleDrop(event, 'done'); }

  private handleDrop(event: CdkDragDrop<Task[]>, targetStatus: Task['status']) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const moved = event.container.data[event.currentIndex];
      if (moved && moved.status !== targetStatus) {
        this.taskService.updateTask(moved.id, { status: targetStatus }).subscribe(() => {
          const updated = this.allTasks().map(t => t.id === moved.id ? { ...t, status: targetStatus } : t);
          this.allTasks.set(updated);
          this.refillLanes();
        });
      }
    }
  }

  doSearch() { this.refillLanes(); }
  clearSearch() { this.search.set(''); this.refillLanes(); }

  onFiltersChange() { this.refillLanes(); }
}
