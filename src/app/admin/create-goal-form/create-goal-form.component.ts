import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
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
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoalsService } from '../services/goals.service';
import { DepartmentsService } from '../services/departments.service';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { GoalTypeEnum } from '../goal-type.enum';

@Component({
  selector: 'app-create-goal-form',
  imports: [
    MatCard,
    MatCardContent,
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
  ],
  templateUrl: './create-goal-form.component.html',
  styleUrl: './create-goal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CreateGoalFormComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private goalsService = inject(GoalsService);
  private departmentsService = inject(DepartmentsService);
  private snackBar = inject(MatSnackBar);

  // Signals
  departments = signal<DepartmentDto[]>([]);
  goalTemplates = signal<GoalDto[]>([]);
  isLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  goalId = signal<number | null>(null);

  // Form controls with signals
  nameControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(100),
  ]);
  measureControl = new FormControl('', [
    Validators.required,
  ]);
  typeControl = new FormControl(GoalTypeEnum.Operational, [
    Validators.required,
    Validators.maxLength(100),
  ]);
  isTemplateControl = new FormControl(false);
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
    // Initialize from route params
    this.initFromRouteParams();

    // Load data
    this.loadFormDependencies();

    // Setup effects
    this.setupFormEffects();
  }

  private initFromRouteParams(): void {
    // Handle query params
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (params['isTemplate']) {
        this.isTemplateControl.setValue(true);
      }
    });

    // Handle route params for edit mode
    this.route.params.pipe(takeUntilDestroyed()).subscribe((params) => {
      console.log(params);
      if (params['id']) {
        this.isEditMode.set(true);
        this.goalId.set(+params['id']);
        this.loadGoalData();
      }
    });
  }

  private setupFormEffects(): void {
    effect(() => {
      const isTemplate = this.isTemplateControl.value;

      if (isTemplate) {
        this.departmentIdControl.setValue(null);
        // this.departmentIdControl.disable();
      } else {
        this.departmentIdControl.enable();
      }
    });
  }

  loadFormDependencies(): void {
    this.isLoading.set(true);

    forkJoin({
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
          `Goal ${this.isEditMode() ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );

        if (goal.isTemplate) {
          this.router.navigate(['/app/admin/goal-templates']);
        } else {
          this.router.navigate(['/goals', goal.id]);
        }
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

  onCancel(): void {
    if (this.isEditMode() && this.goalId()) {
      this.router.navigate(['/goals', this.goalId()]);
    } else {
      this.router.navigate(['/app/admin/goal-templates']);
    }
  }
}
