import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-completion-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="w-full h-56">
      <canvas baseChart [data]="data" [options]="options" chartType="bar"></canvas>
    </div>
  `
})
export class CompletionChartComponent implements OnChanges {
  @Input() tasks: any[] = [];

  data: ChartConfiguration<'bar'>['data'] = { labels: ['To Do', 'In Progress', 'Done'], datasets: [{ data: [0,0,0], label: 'Tasks' }] };
  options: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { stacked: false }, y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  ngOnChanges() {
    const todo = this.tasks.filter(t => t.status === 'todo').length;
    const doing = this.tasks.filter(t => t.status === 'in_progress').length;
    const done = this.tasks.filter(t => t.status === 'done').length;
    this.data = { ...this.data, datasets: [{ ...this.data.datasets[0], data: [todo, doing, done] }] };
  }
}
