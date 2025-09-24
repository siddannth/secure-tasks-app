import { render, screen } from '@testing-library/angular';
import { TaskListComponent } from './task-list.component';
import { TaskService } from './task.service';
import { of } from 'rxjs';

describe('TaskListComponent (Jest)', () => {
  it('should render "Task Dashboard"', async () => {
    await render(TaskListComponent, {
      providers: [
        {
          provide: TaskService,
          useValue: {
            getTasks: () => of([]),
            deleteTask: () => of({}),
            updateTask: () => of({}),
          },
        },
      ],
    });

    expect(screen.getByText('Task Dashboard')).toBeTruthy();
  });
});
