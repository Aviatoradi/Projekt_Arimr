import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy, signal,
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProgramsService } from '../services/programs.service';
import { ProgramsFormComponent } from '../programs-form/programs-form.component';
import { ProgramDto } from '../dtos';

@Component({
  selector: 'app-programs',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProgramsService],
})
export class ProgramsComponent {
  private programsService = inject(ProgramsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  programs = this.programsService.programs;
  loading = signal(false);
  error = this.programsService.error;

  displayedColumns: string[] = ['id', 'name', 'goalName', 'actions'];

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programsService.loadPrograms();
  }

  openCreateProgramDialog(): void {
    const dialogRef = this.dialog.open(ProgramsFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPrograms();
        this.snackBar.open('Program został pomyślnie utworzony', 'Zamknij', {
          duration: 3000,
        });
      }
    });
  }

  openEditProgramDialog(program: ProgramDto): void {
    const dialogRef = this.dialog.open(ProgramsFormComponent, {
      width: '600px',
      data: { mode: 'edit', programId: program.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPrograms();
        this.snackBar.open(
          'Program został pomyślnie zaktualizowany',
          'Zamknij',
          {
            duration: 3000,
          }
        );
      }
      this.programsService.resetSelectedProgram();
    });
  }

  deleteProgram(program: ProgramDto): void {
    if (confirm(`Czy na pewno chcesz usunąć program "${program.name}"?`)) {
      this.programsService.deleteProgram(program.id).subscribe((success) => {
        this.snackBar.open('Program został pomyślnie usunięty', 'Zamknij', {
          duration: 3000,
        });
      });
    }
  }

  viewProgramDetails(program: ProgramDto): void {
    this.router.navigate(['/programs', program.id]);
  }

  getGoalName(program: ProgramDto): string {
    return program.goal ? program.goal.name : 'Brak przypisanego celu';
  }
}
