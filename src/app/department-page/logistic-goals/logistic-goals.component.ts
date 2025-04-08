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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoalDto } from '../../admin/dtos';
import { LogisticGoalsService } from '../../services/logistic-goals.service';
import { AddLogisticGoalDialogComponent } from './add-logistic-goal-dialog.component';

@Component({
  selector: 'app-logistic-goals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './logistic-goals.component.html',
  styleUrl: './logistic-goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogisticGoalsComponent {
  private logisticGoalsService = inject(LogisticGoalsService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  departmentId = input.required({ transform: numberAttribute });

  logisticGoals = signal<GoalDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {
    this.loadLogisticGoals();
  }

  loadLogisticGoals(): void {
    this.loading.set(true);
    this.error.set(false);

    this.logisticGoalsService
      .getLogisticGoalsByDepartmentId(this.departmentId())
      .subscribe({
        next: (data) => {
          this.logisticGoals.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading logistic goals:', err);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  openAddLogisticGoalDialog(): void {
    // Ensure departmentId is available
    const currentDepartmentId = this.departmentId();
    console.log('Opening dialog with departmentId:', currentDepartmentId);

    const dialogRef = this.dialog.open(AddLogisticGoalDialogComponent, {
      width: '650px',
      data: { departmentId: currentDepartmentId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadLogisticGoals();
      }
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
