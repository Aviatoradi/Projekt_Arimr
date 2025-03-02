import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

interface DialogData {
  title: string;
  interventionId: number;
}

@Component({
  selector: 'app-intakes-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
  ],
  templateUrl: './intakes-form.component.html',
  styleUrl: './intakes-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntakesFormComponent {
  private fb = inject(FormBuilder);

  form!: FormGroup;
  minDate: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<IntakesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    // Set default end date to 30 days from now
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      endDate: [defaultEndDate, [Validators.required]],
      interventionId: [this.data.interventionId, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
