import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
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
    MatInput,
    NgForOf,
  ],
  templateUrl: './create-goal-form.component.html',
  styleUrl: './create-goal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGoalFormComponent {
  goalForm: FormGroup;
  departments: DepartmentDto[] = [];
  goalTemplates: GoalDto[] = [];
  isEditMode = false;
  goalId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private goalsService: GoalsService,
    private departmentsService: DepartmentsService,
    private snackBar: MatSnackBar
  ) {
    this.goalForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      measure: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.maxLength(100)]],
      isTemplate: [false],
      departmentId: [null],
      parentGoalId: [null],
    });
  }

  ngOnInit(): void {
    // Handle query params first (for creating a template directly)
    this.route.queryParams.subscribe((params) => {
      if (params['isTemplate']) {
        this.goalForm.patchValue({ isTemplate: true });
      }
    });

    // Handle route params for edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.goalId = +params['id'];
        this.loadGoalData();
      }
    });

    this.loadFormDependencies();
  }

  loadFormDependencies(): void {
    this.isLoading = true;
    forkJoin({
      departments: this.departmentsService.getAllDepartments(),
      templates: this.goalsService.getGoalTemplates(),
    }).subscribe({
      next: (result) => {
        this.departments = result.departments;
        this.goalTemplates = result.templates;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading form dependencies', error);
        this.snackBar.open('Failed to load form data', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  loadGoalData(): void {
    if (!this.goalId) return;

    this.isLoading = true;
    this.goalsService.getGoalById(this.goalId).subscribe({
      next: (goal) => {
        this.goalForm.patchValue({
          name: goal.name,
          measure: goal.measure,
          type: goal.type,
          isTemplate: goal.isTemplate,
          departmentId: goal.departmentId || null,
          parentGoalId: goal.parentGoalId || null,
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading goal data', error);
        this.snackBar.open('Failed to load goal data', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.goalForm.invalid) return;

    this.isLoading = true;
    const goalData = this.goalForm.value;

    // Make sure departmentId is null for templates
    if (goalData.isTemplate) {
      goalData.departmentId = null;
    }

    // Handle empty string or undefined values
    if (!goalData.departmentId) delete goalData.departmentId;
    if (!goalData.parentGoalId) delete goalData.parentGoalId;

    const request =
      this.isEditMode && this.goalId
        ? this.goalsService.updateGoal(this.goalId, goalData)
        : this.goalsService.createGoal(goalData);

    request.subscribe({
      next: (goal) => {
        this.isLoading = false;
        this.snackBar.open(
          `Goal ${this.isEditMode ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );

        if (goal.isTemplate) {
          this.router.navigate(['/goals/templates']);
        } else {
          this.router.navigate(['/goals', goal.id]);
        }
      },
      error: (error) => {
        console.error(
          `Error ${this.isEditMode ? 'updating' : 'creating'} goal`,
          error
        );
        this.snackBar.open(
          `Failed to ${this.isEditMode ? 'update' : 'create'} goal`,
          'Close',
          { duration: 3000 }
        );
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.goalId) {
      this.router.navigate(['/goals', this.goalId]);
    } else {
      this.router.navigate(['/goals/templates']);
    }
  }

  onTemplateTypeChange(): void {
    const isTemplateControl = this.goalForm.get('isTemplate');
    const departmentIdControl = this.goalForm.get('departmentId');

    if (isTemplateControl?.value) {
      departmentIdControl?.setValue(null);
      departmentIdControl?.disable();
    } else {
      departmentIdControl?.enable();
    }
  }
}
