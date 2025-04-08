import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-add-task-dialog',
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
    <h2 mat-dialog-title>Dodaj zadanie</h2>
    <div mat-dialog-content>
      <form [formGroup]="taskForm" class="flex flex-col gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nazwa zadania</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Wprowadź nazwę zadania"
          />
          <mat-error *ngIf="taskForm.get('name')?.hasError('required')">
            Nazwa jest wymagana
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="flex justify-end gap-2">
      <button mat-button (click)="onCancel()">Anuluj</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="taskForm.invalid || submitting()"
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
export class AddTaskDialogComponent {
  private fb = inject(FormBuilder);
  private tasksService = inject(TasksService);
  private dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  taskForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  submitting = signal<boolean>(false);

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.invalid || !this.data?.goalId) return;

    this.submitting.set(true);

    const task = {
      name: this.taskForm.value.name,
      goalId: this.data.goalId,
    };

    this.tasksService.createTask(task).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.dialogRef.close(result);
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.submitting.set(false);
      },
    });
  }
}
