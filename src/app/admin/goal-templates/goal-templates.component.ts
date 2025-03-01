import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { GoalDto } from '../dtos';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DatePipe, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoalsService } from '../services/goals.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CreateGoalFormComponent } from '../create-goal-form/create-goal-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateGoalFromTemplateComponent } from '../create-goal-from-template/create-goal-from-template.component';
import { GoalTypeEnum } from "../goal-type.enum";

@Component({
  selector: 'app-goal-templates',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatIcon,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    DatePipe,
    MatIconButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatProgressSpinner,
    NgIf,
    MatNoDataRow,
    MatCell,
    MatInput,
    MatLabel,
    MatPaginator,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
  templateUrl: './goal-templates.component.html',
  styleUrl: './goal-templates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalTemplatesComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'measure',
    'type',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<GoalDto>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private goalsService: GoalsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGoalTemplates();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGoalTemplates(): void {
    this.loading = true;
    this.goalsService.getGoalTemplates().subscribe({
      next: (templates) => {
        this.dataSource.data = templates;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading goal templates', error);
        this.snackBar.open('Failed to load goal templates', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateGoalFormComponent, {
      minWidth: 600,
      data: {
        isTemplate: true,
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((goal) => {
      if (goal) {
        this.loadGoalTemplates();
      }
    });
  }

  editTemplate(template: GoalDto): void {
    const dialogRef = this.dialog.open(CreateGoalFormComponent, {
      minWidth: 600,
      data: {
        isTemplate: true,
        mode: 'edit',
        goalId: template.id,
      },
    });

    dialogRef.afterClosed().subscribe((goal) => {
      if (goal) {
        this.loadGoalTemplates();
      }
    });
  }

  viewTemplate(template: GoalDto): void {
    this.router.navigate([`/goals/${template.id}`]);
  }

  deleteGoalTemplate(template: GoalDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Usuń szablon celu',
        message: `Czy na pewno chcesz usunąć szablon "${template.name}"?`,
        confirmText: 'Usuń',
        cancelText: 'Anuluj',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goalsService.deleteGoal(template.id).subscribe({
          next: () => {
            this.snackBar.open(
              'Szablon celu został pomyślnie usunięty',
              'Zamknij',
              { duration: 3000 }
            );
            this.loadGoalTemplates();
          },
          error: (error) => {
            console.error('Błąd podczas usuwania szablonu celu', error);
            this.snackBar.open(
              'Nie udało się usunąć szablonu celu',
              'Zamknij',
              { duration: 3000 }
            );
          },
        });
      }
    });
  }

  createFromTemplate(template: GoalDto): void {
    const dialogRef = this.dialog.open(CreateGoalFromTemplateComponent, {
      width: '500px',
      data: { templateId: template.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Goal created from template successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }
  show() {}

  protected readonly GoalTypeEnum = GoalTypeEnum;
}
