import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { skipPartiallyEmittedExpressions } from 'typescript';

interface GoalMetric {
  name: string;
  description: string;
  plannedValue: string | number;
}

interface Goal {
  department: string;
  goal: string;
  metrics: GoalMetric[];
  tasks: string[];
}

interface ReportRow {
  Departament: string;
  Cel: string;
  Miernik: string;
  'Opis Miernika': string;
  'Planowana Wartość 2025': string | number;
  Zadania: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportGeneratorService {
  generateReport(selectedGoals: Goal[], customGoals: Goal[]) {
    const systemGoalsSheet: ReportRow[] = [];
    selectedGoals.forEach(goal => {
      goal.metrics.forEach(metric => {
        systemGoalsSheet.push({
          Departament: goal.department,
          Cel: goal.goal,
          Miernik: metric.name,
          'Opis Miernika': metric.description,
          'Planowana Wartość 2025': metric.plannedValue,
          Zadania: goal.tasks.join(', '),
        });
      });
    });

    const customGoalsSheet: ReportRow[] = [];
    customGoals.forEach(goal => {
      goal.metrics.forEach(metric => {
        customGoalsSheet.push({
          Departament: goal.department || 'Nieokreślony',
          Cel: goal.goal,
          Miernik: metric.name,
          'Opis Miernika': metric.description,
          'Planowana Wartość 2025': metric.plannedValue,
          Zadania: goal.tasks.join(', '),
        });
      });
    });

    const workbook = XLSX.utils.book_new();

    const systemSheet = XLSX.utils.json_to_sheet(systemGoalsSheet);
    XLSX.utils.book_append_sheet(workbook, systemSheet, 'Cele Systemowe');

    const customSheet = XLSX.utils.json_to_sheet(customGoalsSheet);
    XLSX.utils.book_append_sheet(workbook, customSheet, 'Cele Własne');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Podsumowanie_Celow_2025');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }
}