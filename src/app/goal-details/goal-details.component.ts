import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  CreateIntakeApplicationDto,
  GoalDto,
  IntakeApplicationDto,
  IntakeDto,
  InterventionDto,
  ProgramDto,
} from '../admin/dtos';
import { GoalsService } from '../services/goals.service';
import { IntakeApplicationService } from '../services/intake-application.service';
import { parseJSON } from 'date-fns/fp/parseJSON';
import { MatTooltip } from '@angular/material/tooltip';
import { TasksComponent } from "../goals/tasks/tasks.component";
import { LogisticApplicationService, CreateLogisticApplicationDto, LogisticApplicationDto } from '../services/logistic-application.service';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltip,
    TasksComponent
],
  templateUrl: './goal-details.component.html',
})
export class GoalDetailsComponent implements OnInit {
  private router = inject(Router);
  private goalService = inject(GoalsService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private readonly intakeApplicationService = inject(IntakeApplicationService);
  private readonly logisticApplicationService = inject(LogisticApplicationService);

  goalId = input.required({ transform: numberAttribute });
  departmentId = input.required({ transform: numberAttribute });

  goal = signal<GoalDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  programs = signal<ProgramDto[]>([]);
  selectedProgram = signal<ProgramDto | null>(null);

  interventions = signal<InterventionDto[]>([]);
  selectedIntervention = signal<InterventionDto | null>(null);

  intakes = signal<IntakeDto[]>([]);
  selectedIntake = signal<IntakeDto | null>(null);

  applicationForm: FormGroup = this.fb.group({
    applicationPrediction: [0, [Validators.required, Validators.min(0)]],
    applicationCount: [0, [Validators.required, Validators.min(0)]],
  });
  applications = signal<IntakeApplicationDto[]>([]);
  currentApplication = signal<IntakeApplicationDto | null>(null);
  applicationSaving = signal<boolean>(false);
  
  // For logistic applications
  logisticApplications = signal<LogisticApplicationDto[]>([]);
  currentLogisticApplication = signal<LogisticApplicationDto | null>(null);

  isSelectedIntakePast = computed(() => {
    return this.selectedIntake() && this.isIntakePast(this.selectedIntake());
  });

  readonly isEditing = signal(false);

  latestApplication = computed(() => {
    const applications = this.applications();

    if (applications && applications.length > 0) {
      return applications.sort((a, b) => {
        return (
          parseJSON(b.createdAt).getTime() - parseJSON(a.createdAt).getTime()
        );
      })[0];
    }

    return null;
  });

  ngOnInit(): void {
    this.loadGoalData();
  }

  loadGoalData(): void {
    this.loading.set(true);
    this.error.set(false);

    this.goalService.getGoalById(this.goalId()).subscribe({
      next: (data) => {
        this.goal.set(data);
        this.programs.set(data.programs);
        this.loading.set(false);
        
        // If this is a logistic goal, load the logistic applications
        if (data.type === 'logistic') {
          this.loadLogisticApplications();
        }
      },
      error: (err) => {
        console.error('Error loading goal details:', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
  
  loadLogisticApplications(): void {
    this.logisticApplicationService.getApplicationsByGoalId(this.departmentId(), this.goalId()).subscribe({
      next: (applications) => {
        this.logisticApplications.set(applications);
        if (applications.length > 0) {
          // Sort by creation date, newest first
          const sortedApps = [...applications].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.currentLogisticApplication.set(sortedApps[0]);
        }
      },
      error: (err) => {
        console.error('Error loading logistic applications:', err);
      }
    });
  }
  //
  // loadPrograms(goalId: number): void {
  //   this.goalService.getGoalById(goalId).subscribe({
  //     next: (data) => {
  //       this.programs.set(data.programs);
  //       this.loading.set(false);
  //     },
  //     error: (err) => {
  //       console.error('Error loading programs:', err);
  //       this.error.set(true);
  //       this.loading.set(false);
  //     },
  //   });
  // }

  selectProgram(program: ProgramDto): void {
    this.selectedProgram.set(program);
    this.interventions.set(program.interventions);
    this.selectedIntervention.set(null);
    this.selectedIntake.set(null);
    this.intakes.set([]);
  }

  deselectProgram(): void {
    this.selectedProgram.set(null);
    this.selectedIntervention.set(null);
    this.selectedIntake.set(null);
    this.interventions.set([]);
    this.intakes.set([]);
  }

  selectIntervention(intervention: InterventionDto): void {
    this.selectedIntervention.set(intervention);
    this.intakes.set(intervention.intakes);
    this.selectedIntake.set(null);
  }

  deselectIntervention(): void {
    this.selectedIntervention.set(null);
    this.selectedIntake.set(null);
    this.intakes.set([]);
  }

  isIntakePast(intake: IntakeDto): boolean {
    return new Date(intake.endDate) < new Date();
  }

  isIntakeFuture(intake: IntakeDto): boolean {
    // Przyszły nabór - data zakończenia jest co najmniej 7 dni w przyszłości
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    return new Date(intake.endDate) > oneWeekFromNow;
  }

  selectIntake(intake: IntakeDto): void {
    if (intake.id === this.selectedIntake()?.id) {
      return;
    }

    this.selectedIntake.set(intake);
    this.applications.set(intake.applications);
    this.currentApplication.set(null);
    this.isEditing.set(false);
    this.applicationForm.reset();
  }

  setApplicationFormValue(application: IntakeApplicationDto): void {
    this.applicationForm.setValue({
      applicationPrediction: application.applicationPrediction,
      applicationCount: application.applicationCount,
    });
  }

  deselectIntake(): void {
    this.selectedIntake.set(null);
    this.applicationForm = null;
  }

  saveApplication(): void {
    if (
      !this.applicationForm ||
      this.applicationForm.invalid ||
      !this.selectedIntake()
    ) {
      return;
    }

    this.applicationSaving.set(true);

    const application: CreateIntakeApplicationDto = {
      applicationPrediction: this.applicationForm.value.applicationPrediction,
      applicationCount: this.applicationForm.value.applicationCount,
      intakeId: this.selectedIntake()!.id,
      departmentId: this.departmentId(),
    };

    this.intakeApplicationService.create(application).subscribe({
      next: (data) => {
        this.goalService
          .getGoalById(this.goalId())
          .subscribe((goal: GoalDto) => {

            if (goal.type === 'logistic') {
              this.loadLogisticApplications();
              return;
            }

            const program = goal.programs.find(
              (p) => p.id === this.selectedProgram().id
            );
            const intervention = program.interventions.find(
              (intervention) =>
                intervention.id === this.selectedIntervention().id
            );
            const intake = intervention.intakes.find(
              (intake: IntakeDto) => intake.id === this.selectedIntake().id
            );

            this.applications.set(intake.applications);
            this.applicationSaving.set(false);
            this.snackBar.open('Dane zostały zapisane pomyślnie', 'Zamknij', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          });
      },
      error: (err) => {
        console.error('Error saving application:', err);
        this.snackBar.open(
          'Wystąpił błąd podczas zapisywania danych',
          'Zamknij',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
        this.applicationSaving.set(false);
      },
    });

    // this.goalService.createOrUpdateIntakeApplication(application).subscribe({
    //   next: (data) => {
    //     this.currentApplication.set(data);
    //     this.snackBar.open('Dane zostały zapisane pomyślnie', 'Zamknij', {
    //       duration: 3000,
    //       horizontalPosition: 'end',
    //       verticalPosition: 'top',
    //     });
    //     this.applicationSaving.set(false);
    //   },
    //   error: (err) => {
    //     console.error('Error saving application:', err);
    //     this.snackBar.open('Wystąpił błąd podczas zapisywania danych', 'Zamknij', {
    //       duration: 3000,
    //       horizontalPosition: 'end',
    //       verticalPosition: 'top',
    //     });
    //     this.applicationSaving.set(false);
    //   }
    // });
  }

  navigateBack(): void {
    this.router.navigate(['/goals']);
  }

  createApplication() {
    this.applicationForm.reset();
    this.isEditing.set(true);
  }

  editIntakeApplication() {
    this.isEditing.set(true);
    this.setApplicationFormValue(this.latestApplication());
  }
  
  // Logistic application methods
  createLogisticApplication() {
    this.applicationForm.reset();
    this.isEditing.set(true);
  }
  
  editLogisticApplication() {
    if (this.currentLogisticApplication()) {
      this.isEditing.set(true);
      this.applicationForm.setValue({
        applicationPrediction: this.currentLogisticApplication()!.applicationPrediction,
        applicationCount: this.currentLogisticApplication()!.applicationCount
      });
    }
  }
  
  saveLogisticApplication() {
    if (this.applicationForm.invalid) {
      return;
    }
    
    this.applicationSaving.set(true);
    
    const application: CreateLogisticApplicationDto = {
      applicationPrediction: this.applicationForm.value.applicationPrediction,
      applicationCount: this.applicationForm.value.applicationCount,
      goalId: this.goalId()
    };
    
    this.logisticApplicationService.createApplication(this.departmentId(), application).subscribe({
      next: (data) => {
        // Refresh the applications list
        this.loadLogisticApplications();
        this.applicationSaving.set(false);
        this.isEditing.set(false);
        
        this.snackBar.open('Dane zostały zapisane pomyślnie', 'Zamknij', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Error saving logistic application:', err);
        this.snackBar.open(
          'Wystąpił błąd podczas zapisywania danych',
          'Zamknij',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
        this.applicationSaving.set(false);
      }
    });
  }
}
