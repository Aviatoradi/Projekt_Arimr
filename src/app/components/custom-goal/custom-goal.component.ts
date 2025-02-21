import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import {DataService} from '../../data.service';



@Component({
  selector: 'app-custom-goal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './custom-goal.component.html',
})
export class CustomGoalComponent implements OnInit {
  customGoal: string = '';
  customMetric: string = '';
  customDescription: string = '';
  customPlannedValue: string = '';
  customTasks: string = '';
  selectedDepartment: { name: string } | null = null;

  constructor(private dataService: DataService) { }
  
  ngOnInit(): void {
  this.selectedDepartment = this.dataService.selectedDepartment;
  console.log('Wybrany departament:', this.selectedDepartment);
}

  

  saveCustomGoal(): void {
  if (this.customGoal.trim() &&
    this.customMetric.trim() &&
    this.customDescription.trim() &&
    this.customPlannedValue.trim() &&
    this.selectedDepartment)
  {
    const newGoal = {
      goal: this.customGoal,
      metricName: this.customMetric,
      metricDescription: this.customDescription, // Dodaj opis miernika
      level: this.customPlannedValue,
      tasks: this.customTasks,
      department: this.selectedDepartment.name, // Pobierz nazwę departamentu
    };

    this.dataService.savedData.push(newGoal);

    // Resetowanie pól formularza
    this.customGoal = '';
    this.customMetric = '';
    this.customDescription = '';
    this.customPlannedValue = '';
    this.customTasks = '';

    alert('Cel został zapisany!');
  } else {
    alert('Proszę wypełnić wszystkie wymagane pola, w tym departament!');
  }
}

}
