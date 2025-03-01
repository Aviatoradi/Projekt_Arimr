import {
  Component,
  Inject,
  OnInit,
  inject,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgramsService } from '../services/programs.service';
import { CreateProgramDto, UpdateProgramDto } from '../dtos';
import { toSignal } from '@angular/core/rxjs-interop';

interface DialogData {
  mode: 'create' | 'edit';
  programId?: number;
  initialGoalId?: number;
}

@Component({
  selector: 'app-programs-form',
  templateUrl: './programs-form.component.html',
  styleUrl: './programs-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  providers: [ProgramsService],
})
export class ProgramsFormComponent implements OnInit {
  private programsService = inject(ProgramsService);
  private fb = inject(FormBuilder);

  dialogRef = inject(MatDialogRef<ProgramsFormComponent>);

  data = inject(MAT_DIALOG_DATA);

  readonly editingProgram = this.programsService.selectedProgram;

  availableGoals = this.programsService.availableGoals;
  programsLoading = signal(false);
  loading = this.programsService.loading;
  error = this.programsService.error;

  programForm;

  get dialogTitle(): string {
    return this.data.mode === 'edit' ? 'Edytuj program' : 'Utwórz nowy program';
  }

  get submitButtonText(): string {
    return this.data.mode === 'edit' ? 'Zapisz zmiany' : 'Utwórz program';
  }

  get isEditing(): boolean {
    return this.data.mode === 'edit';
  }

  constructor() {
    this.programsService.loadAvailableGoals();
    this.isEditing && this.programsService.getProgram(this.data.programId);

    effect(() => {
      if (
        this.availableGoals().length > 0 &&
        this.data.initialGoalId &&
        this.data?.mode === 'create'
      ) {
        this.programForm.controls['goalId'].setValue(this.data.initialGoalId);
      }
    });

    effect(() => {
      const editingProgram = this.editingProgram();

      console.log(editingProgram);
      if (editingProgram) {
        this.programForm.setValue({
          name: editingProgram.name,
          goalId: editingProgram.goalId,
        });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.programForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      goalId: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.programForm.invalid) {
      return;
    }

    const formValue = this.programForm.value;

    if (this.isEditing && this.data.programId) {
      const updateDto: UpdateProgramDto = {
        name: formValue.name,
        goalId: formValue.goalId,
      };

      this.programsService
        .updateProgram(this.data.programId, updateDto)
        .subscribe((result) => {
          if (result) {
            this.dialogRef.close(true);
          }
        });
    } else {
      const createDto: CreateProgramDto = {
        name: formValue.name,
        goalId: formValue.goalId,
      };

      this.programsService.createProgram(createDto).subscribe((result) => {
        if (result) {
          this.dialogRef.close(true);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
