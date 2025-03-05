import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { DepartmentDto, GoalDto } from '../dtos';
import { GoalsService } from '../../services/goals.service';
import { DepartmentsService } from '../../services/departments.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

export interface GoalTemplateDialogData {
  goal: GoalDto;
  departments: DepartmentDto[];
}

@Component({
  selector: 'app-create-goal-from-template',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-goal-from-template.component.html',
})
export class CreateGoalFromTemplateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private goalService = inject(GoalsService);
  readonly departments = toSignal(
    inject(DepartmentsService).getAllDepartments()
  );
  readonly router = inject(Router);

  goalForm!: FormGroup;
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<CreateGoalFromTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GoalTemplateDialogData
  ) {}

  ngOnInit(): void {
    this.goalForm = this.fb.group({
      name: [this.data.goal.name, Validators.required],
      measure: [this.data.goal.measure, Validators.required],
      type: [this.data.goal.type, Validators.required],
      departmentId: [null, Validators.required],
      parentGoalId: [this.data.goal.id],
      isTemplate: [false],
    });
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);

      this.goalService
        .createFromTemplate(this.data.goal.id, this.goalForm.value.departmentId)
        .subscribe({
          next: (createdGoal) => {
            this.isSubmitting.set(false);
            this.dialogRef.close(createdGoal);
            this.router.navigate(['/app/admin/department-goals'], {
              queryParams: {
                departmentId: this.goalForm.value.departmentId,
              },
            });
          },
          error: (error) => {
            this.isSubmitting.set(false);
            console.error('Błąd podczas tworzenia celu:', error);
            this.errorMessage.set(
              'Wystąpił błąd podczas tworzenia celu. Spróbuj ponownie.'
            );
            // Tutaj można dodać obsługę błędów, np. wyświetlenie komunikatu
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
