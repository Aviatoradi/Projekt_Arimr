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
  ],
  templateUrl: './goal-editor.component.html',
})
export class GoalEditorComponent {
  selectedDepartment: any = null;
  selectedGoal: any = null;
  customMetric: string = ''; // Przechowuje nazwę miernika dla aktualnie wybranego celu
  customDescription: string = ''; // Przechowuje opis miernika dla aktualnie wybranego celu
  customTask: string = '';  // Przechowuje nowe zadanie


  constructor(public exportService: ExportService, public dataService: DataService, private snackBar: MatSnackBar) { }

exportToExcel(): void {
    console.log('🔹 Eksportowanie danych:', this.dataService.savedData);
  this.exportService.exportToExcel(this.dataService.savedData);

  const formattedData = this.dataService.savedData.map((item, index) => ({
    goal: item.goal || 'Brak celu',
    metricName: item.metricName || 'Brak miernika',
    metricDescription: item.metricDescription || '',
    plannedValue: item.plannedValue || '',
    tasks: typeof item.tasks === 'string' && item.tasks.trim() !== ''
      ? item.tasks  // ✅ Jeśli `tasks` to string, zapisujemy go normalnie
      : Array.isArray(item.tasks) && item.tasks.length > 0
        ? item.tasks.join(',')  // ✅ Jeśli `tasks` to tablica, zamieniamy na string
        : 'Brak zadań',
    department: item.department || '',
  }));

  console.log('✅ Sformatowane dane do eksportu:', formattedData);

  this.exportService.exportToExcel(formattedData);
}




  ngOnInit(): void {
  // Przywrócenie wybranego departamentu po przejściu do innej zakładki
  this.selectedDepartment = this.dataService.getSelectedDepartment();
}

    addCustomGoal() {
    if (!this.selectedDepartment) {
      alert('Wybierz departament przed dodaniem celu!');
      return;
    }
    }
  
  selectDepartment(department: any): void {
    this.selectedDepartment = department;
    this.dataService.selectedDepartment = department; // Zapisanie do DataService
    this.selectedGoal = null; // Resetowanie celu
  }

  
selectGoal(goal: any) {
  this.selectedGoal = goal;

  // Sprawdź, czy cel ma listę metrics, i przypisz pierwszy metric, jeśli istnieje
  if (this.selectedGoal.metrics && this.selectedGoal.metrics.length > 0) {
    this.selectedGoal.metric = this.selectedGoal.metrics[0]; // Pobiera pierwszy miernik z listy
  } else {
    this.selectedGoal.metric = { name: '', description: '', level: '' }; // Domyślny metric
  }

  // Aktualizuj `customMetric` i `customDescription`
  this.customMetric = this.selectedGoal.metric.name || '';
  this.customDescription = this.selectedGoal.metric.description || '';

  // Automatyczna aktualizacja numeracji zadań po załadowaniu celu
  this.updateTaskNumbers();

  console.log('Wybrany cel:', this.selectedGoal);
  console.log('Wybrany miernik:', this.selectedGoal.metric);
}

  
  addTask(task: string) {
  if (task.trim() && this.selectedGoal) {
    if (!this.selectedGoal.tasks) {
      this.selectedGoal.tasks = []; // Inicjalizacja, jeśli tasks jest puste
    }

    const cleanedTask = task.trim().replace(/\n/g, ''); // Usuń nowe linie
    const taskNumber = this.selectedGoal.tasks.length + 1; // Nowy numer
    this.selectedGoal.tasks.push(`${taskNumber}. ${cleanedTask}`); // Dodajemy z numerem
    this.updateTaskNumbers(); // Aktualizacja numeracji
    console.log('Dodano zadanie:', cleanedTask);
  }
    // Resetowanie pola tekstowego
    this.customTask = '';
}



  addMetric() {
    if (this.selectedGoal) {
      this.selectedGoal.metrics.push({ name: '', description: '', level: '' });
    }
  }


  removeMetric(index: number) {
    if (this.selectedGoal) {
      this.selectedGoal.metrics.splice(index, 1);
    }
  }
  autoResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto'; // Resetuj wysokość
    textarea.style.height = textarea.scrollHeight + 'px'; // Dopasuj wysokość do zawartości
    
  }

  saveLevel(level: string) {
    if (this.selectedGoal && this.selectedGoal.metric) {
      console.log('Zapisuję poziom:', level);
      this.selectedGoal.metric.level = level.trim();
    }
  }


  removeTask(index: number) {
  if (this.selectedGoal) {
    this.selectedGoal.tasks.splice(index, 1); // Usuń zadanie
    this.updateTaskNumbers(); // Zaktualizuj numerację
  }
}
updateTaskNumbers(): void {
  if (this.selectedGoal?.tasks) {
    this.selectedGoal.tasks = this.selectedGoal.tasks.map(
      (task: string, index: number) =>
        `${index + 1}. ${task.replace(/^\d+\.\s*/, '').trim().replace(/\n/g, '')}` // Usuń istniejącą numerację i nowe linie
    );
  }
}



saveData() {
  console.log('Selected Department:', this.selectedDepartment);
  console.log('Selected Goal:', this.selectedGoal);
  console.log('Tasks before saving:', this.selectedGoal?.tasks);
  console.log('Czy tasks są poprawne?', JSON.stringify(this.dataService.savedData, null, 2));
  console.log('🔍 Sprawdzenie danych przed eksportem:', JSON.stringify(this.dataService.savedData, null, 2));


  if (this.selectedDepartment && this.selectedGoal && this.selectedGoal.metric?.level?.trim()) {
    const savedEntry = {
      goal: this.selectedGoal.name,
      metricName: this.selectedGoal.metric.name,
      metricDescription: this.selectedGoal.metric.description || 'Brak opisu',
      level: this.selectedGoal.metric.level.trim(),
      tasks: Array.isArray(this.selectedGoal.tasks) && this.selectedGoal.tasks.length > 0
        ? this.selectedGoal.tasks.join('\n')  // ✅ Łączymy zadania w jeden string z nowymi liniami
        : 'Brak zadań', 
      department: this.selectedDepartment.name,
    };

    this.dataService.savedData.push(savedEntry);
    console.log('✅ Dane zapisane:', savedEntry); // Debugging
    this.selectedGoal = null;
    alert('Dane zapisane pomyślnie!');
  } else {
    let errorMessage = 'Wprowadź wymagane dane przed zapisaniem!\n';
    if (!this.selectedDepartment) errorMessage += '- Wybierz departament\n';
    if (!this.selectedGoal) errorMessage += '- Wybierz cel\n';
    if (!this.selectedGoal?.metric?.level?.trim()) errorMessage += '- Uzupełnij poziom\n';
    alert(errorMessage);
  }
}


}