import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card'; // Dla mat-card
import { MatTableModule } from '@angular/material/table'; // Dla mat-table
import { MatInputModule } from '@angular/material/input'; // Dla input
import { FormsModule } from '@angular/forms'; // Dla ngModel
import { DetailDialogComponent } from '../detail-dialog/detail-dialog.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-table-view',
  imports: [
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    MatPaginator,
    CommonModule,
  ],
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.scss'],
})
export class TaskViewComponent implements OnInit{
  displayedColumns: string[] = ['select', 'goal', 'metricName', 'metricDescription', 'level', 'tasks', 'department'];
  selectedDepartment: any = null; // Przechowuje wybrany departament
  selectedGoals: any = null; // Przechowuje wybrany cel
  savedData: any[] = [];

  constructor(public dataService: DataService, private dialog: MatDialog, private location: Location) { }
  
  // Inicjalizacja danych w ngOnInit
  ngOnInit(): void {
    this.savedData = this.dataService.savedData; // Przypisanie danych z DataService
    this.selectedDepartment = this.dataService.selectedDepartment; // Pobierz wybrany departament
    this.selectedGoals = this.dataService.selectedGoals; // Pobierz wybrany cel, jeśli istnieje
  }


  goBack(): void {
  if (this.selectedGoals) {
    this.selectedGoals = null; // Resetuj wybrany cel
  } else {
    this.location.back(); // Wracaj tylko do poprzedniego widoku
  }
  }

  saveChanges() {
    alert('Zmiany zostały zapisane!');
  }
ngAfterViewInit(): void {
  setTimeout(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      (textarea as HTMLTextAreaElement).style.height = 'auto'; // Resetuje wysokość
      (textarea as HTMLTextAreaElement).style.height = `${(textarea as HTMLTextAreaElement).scrollHeight}px`; // Dopasowuje wysokość
    });

    // Wymuszenie odświeżenia tabeli
    const rows = document.querySelectorAll('.mat-row');
    rows.forEach((row) => {
      (row as HTMLElement).style.height = 'auto';
    });
  });
}
  adjustTextareaHeight(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // Resetuje wysokość
  textarea.style.height = `${textarea.scrollHeight}px`; // Dopasowuje wysokość do zawartości

  // Wymuszenie odświeżenia layoutu tabeli
  const parentRow = textarea.closest('.mat-row') as HTMLElement;
  if (parentRow) {
    parentRow.style.height = 'auto'; // Dynamiczna wysokość wiersza
  }
  }
  
 // Zaznacz wszystkie wiersze
toggleSelectAll(event: any): void {
  const isChecked = event.checked;
  this.savedData.forEach(row => (row.isSelected = isChecked));
}

// Sprawdź, czy wszystkie wiersze są zaznaczone
isAllSelected(): boolean {
  return this.savedData.every(row => row.isSelected);
}

// Sprawdź, czy zaznaczone są tylko niektóre wiersze
isIndeterminate(): boolean {
  const selectedCount = this.savedData.filter(row => row.isSelected).length;
  return selectedCount > 0 && selectedCount < this.savedData.length;
}

// Usuń zaznaczone wiersze
removeSelectedRow(): void {
  const initialLength = this.savedData.length;
  this.savedData = this.savedData.filter(row => !row.isSelected);
  if (this.savedData.length < initialLength) {
    alert('Zaznaczone wiersze zostały usunięte!');
  } else {
    alert('Nie zaznaczono żadnych wierszy do usunięcia.');
  }
}


  

selectedRow: any = null; // Przechowuje zaznaczony wiersz

selectRow(row: any): void {
  this.selectedRow = row;
}




  openModal(row: any): void {
    const dialogRef = this.dialog.open(DetailDialogComponent, {
      width: '1000px',
      height: '1000px',
      maxWidth: 'none',
      data: { ...row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(row, result); // Aktualizuj dane
      }
    });
  }
}
