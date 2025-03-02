import { Component, Inject, OnInit, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../api/api-url.token";
import { InterventionDto, ProgramDto } from "../dtos";

interface DialogData {
  title: string;
  intervention?: InterventionDto;
}

@Component({
  selector: 'app-interventions-form',
  templateUrl: './interventions-form.component.html',
  styleUrl: './interventions-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
})
export class InterventionsFormComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  programs = signal<ProgramDto[]>([]);
  loading = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<InterventionsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPrograms();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [
        this.data.intervention?.name || '',
        [Validators.required, Validators.maxLength(100)],
      ],
      programId: [
        this.data.intervention?.programId || '',
        [Validators.required],
      ],
    });
  }

  loadPrograms(): void {
    this.loading.set(true);
    this.http.get<ProgramDto[]>(`${this.apiUrl}/api/programs`).subscribe({
      next: (data) => {
        this.programs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading programs', err);
        this.loading.set(false);
      },
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
