import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { InterventionService } from '../services/intervention.service';
import { InterventionDto } from '../dtos';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { InterventionsFormComponent } from '../interventions-form/interventions-form.component';
import { IntakesFormComponent } from '../intakes-form/intakes-form.component';
import { ManagaIntakesComponent } from '../managa-intakes/managa-intakes.component';

@Component({
  selector: 'app-interventions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './interventions.component.html',
  styleUrls: ['./interventions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionsComponent implements OnInit {
  private interventionService = inject(InterventionService);
  private dialog = inject(MatDialog);

  // Signals
  interventions = signal<InterventionDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Table columns
  displayedColumns: string[] = [
    'name',
    'program',
    'currentIntake',
    'createdAt',
    'actions',
  ];

  ngOnInit(): void {
    this.loadInterventions();
  }

  loadInterventions(): void {
    this.loading.set(true);
    this.error.set(null);

    this.interventionService.getInterventions().subscribe({
      next: (data) => {
        this.interventions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading interventions', err);
        this.error.set(
          'Nie udało się załadować interwencji. Spróbuj ponownie później.'
        );
        this.loading.set(false);
      },
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(InterventionsFormComponent, {
      width: '500px',
      data: { title: 'Dodaj interwencję' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.set(true);
        this.interventionService.createIntervention(result).subscribe({
          next: () => {
            this.loadInterventions();
          },
          error: (err) => {
            console.error('Error creating intervention', err);
            this.error.set('Nie udało się utworzyć interwencji.');
            this.loading.set(false);
          },
        });
      }
    });
  }

  openManageDialog(intervention: InterventionDto): void {
    const dialogRef = this.dialog.open(ManagaIntakesComponent, {
      width: '500px',
      data: { intervention },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.loading.set(true);
    //     this.interventionService.createIntervention(result).subscribe({
    //       next: () => {
    //         this.loadInterventions();
    //       },
    //       error: (err) => {
    //         console.error('Error creating intervention', err);
    //         this.error.set('Nie udało się utworzyć interwencji.');
    //         this.loading.set(false);
    //       },
    //     });
    //   }
    // });
  }

  openEditDialog(intervention: InterventionDto): void {
    const dialogRef = this.dialog.open(InterventionsFormComponent, {
      width: '500px',
      data: {
        title: 'Edytuj interwencję',
        intervention: intervention,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.set(true);
        this.interventionService
          .updateIntervention(intervention.id, result)
          .subscribe({
            next: () => {
              this.loadInterventions();
            },
            error: (err) => {
              console.error('Error updating intervention', err);
              this.error.set('Nie udało się zaktualizować interwencji.');
              this.loading.set(false);
            },
          });
      }
    });
  }

  openAddIntakeDialog(intervention: InterventionDto): void {
    const dialogRef = this.dialog.open(IntakesFormComponent, {
      width: '500px',
      data: {
        title: 'Dodaj nabór',
        interventionId: intervention.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.set(true);
        this.interventionService.createIntake(result).subscribe({
          next: () => {
            this.loadInterventions();
          },
          error: (err) => {
            console.error('Error creating intake', err);
            this.error.set('Nie udało się utworzyć naboru.');
            this.loading.set(false);
          },
        });
      }
    });
  }

  confirmDelete(intervention: InterventionDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Potwierdź usunięcie',
        message: `Czy na pewno chcesz usunąć interwencję "${intervention.name}"?`,
        confirmText: 'Usuń',
        cancelText: 'Anuluj',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.set(true);
        this.interventionService.deleteIntervention(intervention.id).subscribe({
          next: () => {
            this.loadInterventions();
          },
          error: (err) => {
            console.error('Error deleting intervention', err);
            this.error.set('Nie udało się usunąć interwencji.');
            this.loading.set(false);
          },
        });
      }
    });
  }

  getCurrentIntake(intervention: InterventionDto): string {
    if (!intervention.intakes || intervention.intakes.length === 0) {
      return 'Brak aktywnych naborów';
    }

    // Filter for current intakes (end date is in the future)
    const currentIntakes = intervention.intakes.filter(
      (intake) => new Date(intake.endDate) >= new Date()
    );

    if (currentIntakes.length === 0) {
      return 'Brak aktywnych naborów';
    }

    // Sort by end date (ascending) to get the soonest ending intake
    currentIntakes.sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    );

    const currentIntake = currentIntakes[0];
    const endDate = new Date(currentIntake.endDate).toLocaleDateString('pl-PL');

    return `${currentIntake.name} (do ${endDate})`;
  }
}
