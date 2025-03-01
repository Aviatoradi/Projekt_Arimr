import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgForOf, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { DepartmentDto, GoalDto } from '../dtos';
import { forkJoin, of } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalsService } from '../services/goals.service';
import { DepartmentsService } from '../services/departments.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { GoalTypeEnum } from '../goal-type.enum';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';

export interface GoalDialogData {
  mode: 'edit' | 'create';
  goalId?: number;
  isTemplate?: boolean;
}

@Component({
  selector: 'app-create-goal-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatButton,
    MatProgressSpinner,
    NgIf,
    MatLabel,
    MatError,
    MatInput,
    NgForOf,
    CdkTextareaAutosize,
    MatDialogClose,
  ],
  templateUrl: './create-goal-form.component.html',
  styleUrl: './create-goal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CreateGoalFormComponent {
  private dialogRef = inject(
    MatDialogRef<CreateGoalFormComponent, GoalDto | null>
  );
  private dialogData: GoalDialogData = inject(MAT_DIALOG_DATA);
  private goalsService = inject(GoalsService);
  private departmentsService = inject(DepartmentsService);
  private snackBar = inject(MatSnackBar);

  // Expose enum to template
  GoalTypeEnum = GoalTypeEnum;

  // Signals
  departments = signal<DepartmentDto[]>([]);
  goalTemplates = signal<GoalDto[]>([]);
  isLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(this.dialogData.mode === 'edit');
  goalId = signal<number | null>(this.dialogData.goalId || null);
  goalDialogData = signal(this.dialogData);

  // Form controls with signals
  nameControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(100),
  ]);
  measureControl = new FormControl('', [Validators.required]);
  typeControl = new FormControl(GoalTypeEnum.Operational, [
    Validators.required,
    Validators.maxLength(100),
  ]);
  isTemplateControl = new FormControl(this.dialogData.isTemplate || false);
  departmentIdControl = new FormControl<number | null>(null);
  parentGoalIdControl = new FormControl<number | null>(null);

  goalForm = new FormGroup({
    name: this.nameControl,
    measure: this.measureControl,
    type: this.typeControl,
    isTemplate: this.isTemplateControl,
    departmentId: this.departmentIdControl,
    parentGoalId: this.parentGoalIdControl,
  });

  isFormValid = computed(() => this.goalForm.valid);

  constructor() {
    // Load data
    this.loadFormDependencies();

    // Setup effects
    this.setupFormEffects();

    // Load goal data if in edit mode
    if (this.isEditMode() && this.goalId()) {
      this.loadGoalData();
    }
  }

  private setupFormEffects(): void {
    effect(() => {
      const isTemplate = this.isTemplateControl.value;

      if (isTemplate) {
        this.departmentIdControl.setValue(null);
        this.departmentIdControl.disable();
      } else {
        this.departmentIdControl.enable();
      }
    });
  }

  loadFormDependencies(): void {
    this.isLoading.set(true);

    forkJoin({
      // editingGoal: this.isEditMode()
      //   ? this.goalsService.getGoalById(this.goalId())
      //   : of(null),
      departments: this.departmentsService.getAllDepartments(),
      templates: this.goalsService.getGoalTemplates(),
    }).subscribe({
      next: (result) => {
        this.departments.set(result.departments);
        this.goalTemplates.set(result.templates);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading form dependencies', error);
        this.snackBar.open('Failed to load form data', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  loadGoalData(): void {
    const goalId = this.goalId();
    if (!goalId) return;

    this.isLoading.set(true);

    this.goalsService.getGoalById(goalId).subscribe({
      next: (goal) => {
        this.nameControl.setValue(goal.name);
        this.measureControl.setValue(goal.measure);
        this.typeControl.setValue(goal.type as GoalTypeEnum);
        this.isTemplateControl.setValue(goal.isTemplate || false);
        this.departmentIdControl.setValue(goal.departmentId || null);
        this.parentGoalIdControl.setValue(goal.parentGoalId || null);

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading goal data', error);
        this.snackBar.open('Failed to load goal data', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
        this.dialogRef.close(null);
      },
    });
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.isLoading.set(true);

    const goalData = { ...this.goalForm.value } as GoalDto;

    // Make sure departmentId is null for templates
    if (goalData.isTemplate) {
      goalData.departmentId = undefined;
    }

    // Handle empty string or undefined values
    if (!goalData.departmentId) {
      delete goalData.departmentId;
    }
    if (!goalData.parentGoalId) {
      delete goalData.parentGoalId;
    }

    const request =
      this.isEditMode() && this.goalId()
        ? this.goalsService.updateGoal(this.goalId()!, goalData)
        : this.goalsService.createGoal(goalData);

    request.subscribe({
      next: (goal) => {
        this.isLoading.set(false);
        this.snackBar.open(
          `Cel ${this.isEditMode() ? 'zaaktualizwaony' : 'utworzony'} pomyślnie`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(goal);
      },
      error: (error) => {
        console.error(
          `Error ${this.isEditMode() ? 'updating' : 'creating'} goal`,
          error
        );
        this.snackBar.open(
          `Failed to ${this.isEditMode() ? 'update' : 'create'} goal`,
          'Close',
          { duration: 3000 }
        );
        this.isLoading.set(false);
      },
    });
  }
}
