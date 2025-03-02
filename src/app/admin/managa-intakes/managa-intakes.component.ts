import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InterventionService } from '../services/intervention.service';
import { IntakeDto, InterventionDto } from '../dtos';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

interface DialogData {
  intervention: InterventionDto;
}

function MatChipModule() {}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  selector: 'app-managa-intakes',
  styleUrl: './managa-intakes.component.scss',
  templateUrl: './managa-intakes.component.html',
})
export class ManagaIntakesComponent {
  private interventionService = inject(InterventionService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  // Signals
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  intakes = signal<IntakeDto[]>([]);
  isEditing = signal<boolean>(false);
  selectedIntake = signal<IntakeDto | null>(null);

  // Form
  form!: FormGroup;
  minDate: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<ManagaIntakesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIntakes();
  }

  initForm(intake: IntakeDto | null = null): void {
    // Default end date to 30 days from now for new intakes
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);

    this.form = this.fb.group({
      name: [
        intake?.name || '',
        [Validators.required, Validators.maxLength(100)],
      ],
      endDate: [
        intake ? new Date(intake.endDate) : defaultEndDate,
        [Validators.required],
      ],
      interventionId: [this.data.intervention.id, [Validators.required]],
      id: [intake?.id || null],
    });
  }

  loadIntakes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.interventionService
      .getIntakesByInterventionId(this.data.intervention.id)
      .subscribe({
        next: (data) => {
          // Sort intakes with active ones first, then by date (newest first)
          const sortedIntakes = this.sortIntakes(data);
          this.intakes.set(sortedIntakes);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading intakes', err);
          this.error.set('Nie udało się załadować naborów.');
          this.loading.set(false);
        },
      });
  }

  sortIntakes(intakes: IntakeDto[]): IntakeDto[] {
    return [...intakes].sort((a, b) => {
      const aIsActive = this.isIntakeActive(a);
      const bIsActive = this.isIntakeActive(b);

      // Active intakes first
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;

      // Then by end date (newest first)
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });
  }

  isIntakeActive(intake: IntakeDto): boolean {
    return new Date(intake.endDate) >= new Date();
  }

  showAddForm(): void {
    this.selectedIntake.set(null);
    this.initForm();
    this.isEditing.set(true);
  }

  showEditForm(intake: IntakeDto): void {
    this.selectedIntake.set(intake);
    this.initForm(intake);
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.selectedIntake.set(null);
  }

  confirmDelete(intake: IntakeDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Potwierdź usunięcie',
        message: `Czy na pewno chcesz usunąć nabór "${intake.name}"?`,
        confirmText: 'Usuń',
        cancelText: 'Anuluj',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteIntake(intake);
      }
    });
  }

  deleteIntake(intake: IntakeDto): void {
    this.loading.set(true);
    this.interventionService.deleteIntake(intake.id).subscribe({
      next: () => {
        this.loadIntakes();
      },
      error: (err) => {
        console.error('Error deleting intake', err);
        this.error.set('Nie udało się usunąć naboru.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = this.form.value;
    const isUpdate = !!formData.id;

    this.loading.set(true);

    if (isUpdate) {
      // Update existing intake
      this.interventionService.updateIntake(formData.id, formData).subscribe({
        next: () => {
          this.isEditing.set(false);
          this.selectedIntake.set(null);
          this.loadIntakes();
        },
        error: (err) => {
          console.error('Error updating intake', err);
          this.error.set('Nie udało się zaktualizować naboru.');
          this.loading.set(false);
        },
      });
    } else {
      // Create new intake
      this.interventionService.createIntake(formData).subscribe({
        next: () => {
          this.isEditing.set(false);
          this.loadIntakes();
        },
        error: (err) => {
          console.error('Error creating intake', err);
          this.error.set('Nie udało się utworzyć naboru.');
          this.loading.set(false);
        },
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
