import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { Task, TasksService } from '../../services/tasks.service';
import { AddTaskDialogComponent } from './add-task-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  @Input() goalId!: number;
  
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  showTasks = signal<boolean>(false);
  currentUserId = signal<number | null>(null);

  ngOnInit(): void {
    // Get current user ID from auth service
    this.authService.user$.subscribe(user => {
      this.currentUserId.set(user?.id || null);
    });
  }

  toggleTasksVisibility(): void {
    if (!this.showTasks()) {
      this.loadTasks();
    }
    this.showTasks.update(value => !value);
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(false);

    this.tasksService.getTasksByGoalId(this.goalId).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: { goalId: this.goalId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(taskId: number): void {
    this.loading.set(true);
    
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // Check if the current user can delete the task
  canDeleteTask(task: Task): boolean {
    // User can delete a task if they created it or if they're an admin
    const userId = this.currentUserId();
    if (!userId) return false;
    
    // Check if user is the creator of the task
    if (task.createdById === userId) return true;
    
    // Check if user is an admin (assuming role is stored in the auth service)
    const isAdmin = this.authService.user$.value?.role === 'ADMIN';
    return isAdmin;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
