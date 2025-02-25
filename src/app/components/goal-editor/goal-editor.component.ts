import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../data.service';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { ExportService } from '../../services/export.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentsComponent } from "../../departments/departments.component";

@Component({
  selector: 'app-goal-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatListModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    DepartmentsComponent,
  ],
  templateUrl: './goal-editor.component.html',
})
export class GoalEditorComponent {
  selectedDepartment: any = null;
  selectedGoal: any = null;
  customTask: string = '';

  constructor(
    public exportService: ExportService,
    public dataService: DataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.selectedDepartment = this.dataService.getSelectedDepartment();
  }

  selectDepartment(department: any): void {
    this.selectedDepartment = department;
    this.dataService.selectedDepartment = department;
    this.selectedGoal = null;
  }

  selectGoal(goal: any) {
    this.selectedGoal = goal;

    if (this.selectedGoal.metrics && this.selectedGoal.metrics.length > 0) {
      this.selectedGoal.metric = this.selectedGoal.metrics[0];

      // ✅ Jeśli level (planowana wartość) jest puste, ustaw domyślną wartość
      if (!this.selectedGoal.metric.level) {
        this.selectedGoal.metric.level = '';
      }
    } else {
      this.selectedGoal.metric = { name: '', description: '', level: '' };
    }

    console.log('🔹 Wybrany cel:', this.selectedGoal);
    console.log('🔹 Wybrany miernik:', this.selectedGoal.metric);
    console.log('🔹 Planowana wartość:', this.selectedGoal.metric.level);
  }

  addTask(task: string) {
    if (task.trim() && this.selectedGoal) {
      if (!this.selectedGoal.tasks) {
        this.selectedGoal.tasks = [];
      }
      const cleanedTask = task.trim().replace(/\n/g, '');
      const taskNumber = this.selectedGoal.tasks.length + 1;
      this.selectedGoal.tasks.push(`${taskNumber}. ${cleanedTask}`);
      this.updateTaskNumbers();
    }
    this.customTask = '';
  }

  removeTask(index: number) {
    if (this.selectedGoal) {
      this.selectedGoal.tasks.splice(index, 1);
      this.updateTaskNumbers();
    }
  }

  updateTaskNumbers(): void {
    if (this.selectedGoal?.tasks) {
      this.selectedGoal.tasks = this.selectedGoal.tasks.map(
        (task: string, index: number) =>
          `${index + 1}. ${task
            .replace(/^\d+\.\s*/, '')
            .trim()
            .replace(/\n/g, '')}`
      );
    }
  }

  saveLevel(level: string) {
    if (this.selectedGoal && this.selectedGoal.metric) {
      console.log('📌 Zapisuję poziom:', level);
      this.selectedGoal.metric.level = level.trim(); // ✅ Naprawione!

      // ✅ Upewniamy się, że zmiana pojawi się w tabeli
      this.dataService.savedData = this.dataService.savedData.map((entry) =>
        entry.goal === this.selectedGoal.name
          ? { ...entry, level: level.trim() }
          : entry
      );
    }
  }

  saveData() {
    console.log('🔍 Dane przed zapisem:', this.selectedGoal);

    if (
      this.selectedDepartment &&
      this.selectedGoal &&
      this.selectedGoal.metric?.level?.trim()
    ) {
      const savedEntry = {
        goal: this.selectedGoal.name,
        metricName: this.selectedGoal.metric.name,
        metricDescription: this.selectedGoal.metric.description || 'Brak opisu',
        level: this.selectedGoal.metric.level.trim(),
        tasks:
          Array.isArray(this.selectedGoal.tasks) &&
          this.selectedGoal.tasks.length > 0
            ? this.selectedGoal.tasks.join('\n')
            : 'Brak zadań',
        department: this.selectedDepartment.name,
      };

      this.dataService.savedData.push(savedEntry);
      console.log('✅ Dane zapisane:', savedEntry);
      this.selectedGoal = null;
      alert('Dane zapisane pomyślnie!');
    } else {
      let errorMessage = 'Wprowadź wymagane dane przed zapisaniem!\n';
      if (!this.selectedDepartment) errorMessage += '- Wybierz departament\n';
      if (!this.selectedGoal) errorMessage += '- Wybierz cel\n';
      if (!this.selectedGoal?.metric?.level?.trim())
        errorMessage += '- Uzupełnij planowaną wartość\n';
      alert(errorMessage);
    }
  }

  exportToExcel(): void {
    console.log('🔹 Eksportowanie danych:', this.dataService.savedData);
    this.exportService.exportToExcel(this.dataService.savedData);
  }
}
