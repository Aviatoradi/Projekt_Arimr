import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { GoalDto } from '../../admin/dtos';
import { DepartmentsService } from '../../services/departments.service';

@Component({
  selector: 'app-goals-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './goals-list.component.html',
  styleUrl: './goals-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsListComponent {
  private goalService = inject(DepartmentsService);
  private router = inject(Router);

  departmentId = input.required({ transform: numberAttribute });

  goals = signal<GoalDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.loading.set(true);
    this.error.set(false);

    this.goalService.getGoalsByDepartmentId(this.departmentId()).subscribe({
      next: (data) => {
        this.goals.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading goals:', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  navigateToGoalDetails(goalId: number): void {
    this.router.navigate([
      '/app',
      'departments',
      this.departmentId(),
      'goals',
      goalId,
    ]);
  }
}
