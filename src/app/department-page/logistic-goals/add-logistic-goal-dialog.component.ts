import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LogisticGoalsService } from '../../services/logistic-goals.service';

@Component({
  selector: 'app-add-logistic-goal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Dodaj cel logistyczny</h2>
    <div mat-dialog-content>
      <form [formGroup]="goalForm" class="flex flex-col gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nazwa celu</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Wprowadź nazwę celu"
          />
          <mat-error *ngIf="goalForm.get('name')?.hasError('required')">
            Nazwa jest wymagana
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Miara</mat-label>
          <input
            matInput
            formControlName="measure"
            placeholder="Wprowadź miarę celu"
          />
          <mat-error *ngIf="goalForm.get('measure')?.hasError('required')">
            Miara jest wymagana
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="flex justify-end gap-2">
      <button mat-button (click)="onCancel()">Anuluj</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="goalForm.invalid || submitting()"
        (click)="onSubmit()"
      >
        <span *ngIf="!submitting()">Zapisz</span>
        <mat-spinner
          *ngIf="submitting()"
          diameter="20"
          class="inline-block"
        ></mat-spinner>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AddLogisticGoalDialogComponent {
  private fb = inject(FormBuilder);
  private logisticGoalsService = inject(LogisticGoalsService);
  private dialogRef = inject(MatDialogRef<AddLogisticGoalDialogComponent>);

  private readonly data = inject(MAT_DIALOG_DATA);

  goalForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    measure: ['', Validators.required],
  });

  constructor() {
    console.log(this.data?.departmentId);
  }

  submitting = signal<boolean>(false);

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.goalForm.invalid || !this.data?.departmentId) return;

    this.submitting.set(true);

    const goal = {
      name: this.goalForm.value.name,
      measure: this.goalForm.value.measure,
      departmentId: this.data.departmentId,
    };

    this.logisticGoalsService.createLogisticGoal(goal).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.dialogRef.close(result);
      },
      error: (error) => {
        console.error('Error creating logistic goal:', error);
        this.submitting.set(false);
      },
    });
  }
}
