import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { GoalsService } from '../services/goals.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentFilterComponent } from '../department-filter/department-filter.component';
import { DepartmentDto, GoalDto } from '../dtos';
import { DepartmentsService } from '../services/departments.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CreateGoalFormComponent } from '../create-goal-form/create-goal-form.component';

@Component({
  selector: 'app-departments-goals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DepartmentFilterComponent,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './departments-goals.component.html',
})
export class DepartmentsGoalsComponent implements OnInit {
  private goalsService = inject(GoalsService);
  private router = inject(Router);
  private departmentsService = inject(DepartmentsService);
  private route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  departments = signal<DepartmentDto[]>([]);
  selectedDepartmentId = signal<number | null>(null);
  goals = signal<GoalDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed values
  filteredGoals = computed(() => {
    const departmentId = this.selectedDepartmentId();
    if (departmentId === null) {
      return this.goals();
    }
    return this.goals().filter((goal) => goal.departmentId === departmentId);
  });

  displayedColumns: string[] = [
    'id',
    'name',
    'measure',
    'department',
    'actions',
  ];

  constructor() {
    // Effect to sync selectedDepartmentId with route parameters
    effect(() => {
      // Update URL when filter changes (without triggering navigation events)
      const departmentId = this.selectedDepartmentId();
      if (departmentId !== null) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { departmentId },
          queryParamsHandling: 'merge',
          replaceUrl: true, // Use replaceUrl to avoid adding entries to browser history
        });
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { departmentId: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadGoals();

    this.route.queryParams.subscribe((params) => {
      if (params['departmentId']) {
        const departmentId = parseInt(params['departmentId'], 10);
        if (!isNaN(departmentId)) {
          this.selectedDepartmentId.set(departmentId);
        }
      }
    });
  }

  deleteGoalTemplate(template: GoalDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Usuń szablon celu',
        message: `Czy na pewno chcesz usunąć szablon "${template.name}"?`,
        confirmText: 'Usuń',
        cancelText: 'Anuluj',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goalsService.deleteGoal(template.id).subscribe({
          next: () => {
            this.snackBar.open(
              'Szablon celu został pomyślnie usunięty',
              'Zamknij',
              { duration: 3000 }
            );
            this.loadGoals();
          },
          error: (error) => {
            console.error('Błąd podczas usuwania szablonu celu', error);
            this.snackBar.open(
              'Nie udało się usunąć szablonu celu',
              'Zamknij',
              { duration: 3000 }
            );
          },
        });
      }
    });
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.departmentsService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load departments', err);
        this.error.set('Failed to load departments');
        this.loading.set(false);
      },
    });
  }

  loadGoals(): void {
    this.loading.set(true);
    this.goalsService.getAllGoals().subscribe({
      next: (goals) => {
        this.goals.set(goals.filter((goal) => !goal.isTemplate));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load goals', err);
        this.error.set('Failed to load goals');
        this.loading.set(false);
      },
    });
  }

  onDepartmentChange(departmentId: number | null): void {
    this.selectedDepartmentId.set(departmentId);
  }

  viewGoal(id: number): void {
    // Preserve query parameters when navigating to goal details
    this.router.navigate(['/goals', id], {
      queryParamsHandling: 'preserve',
    });
  }

  showAllDepartments(): void {
    this.selectedDepartmentId.set(null);
    // The effect will handle updating the URL
  }

  getDepartmentName(departmentId: number | undefined): string {
    if (!departmentId) return 'N/A';
    const department = this.departments().find((d) => d.id === departmentId);
    return department ? department.name : 'Unknown';
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateGoalFormComponent, {
      minWidth: 600,
      data: {
        isTemplate: false,
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((goal) => {
      if (goal) {
        this.loadGoals();
      }
    });
  }

  editGoal(goal: GoalDto): void {
    const dialogRef = this.dialog.open(CreateGoalFormComponent, {
      minWidth: 600,
      data: {
        isTemplate: false,
        mode: 'edit',
        goalId: goal.id,
      },
    });

    dialogRef.afterClosed().subscribe((goal) => {
      if (goal) {
        this.loadGoals();
      }
    });
  }
}
