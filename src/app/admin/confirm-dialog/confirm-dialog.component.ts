import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">{{ data.title }}</h2>
      <p class="mb-6 text-gray-700">{{ data.message }}</p>
      <div class="flex justify-end gap-4">
        <button 
          mat-button 
          class="text-gray-600"
          (click)="onNoClick()">
          {{ data.cancelText }}
        </button>
        <button 
          mat-raised-button 
          color="warn"
          class="bg-red-600 text-white"
          (click)="onYesClick()">
          {{ data.confirmText }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}