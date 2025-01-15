import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input'; // Dla input i textarea
import { MatButtonModule } from '@angular/material/button'; // Dla przycisków
import { MatDialogModule } from '@angular/material/dialog'; // Dla dialogu
import { FormsModule } from '@angular/forms'; // Dla ngModel

@Component({
  selector: 'app-detail-dialog',
  
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        FormsModule,
    ],
  templateUrl: './detail-dialog.component.html',
})
  
export class DetailDialogComponent {

  
constructor(
  public dialogRef: MatDialogRef<DetailDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: {
    goal: string;
    metricName: string;
    metricDescription: string; // Dodaj opis miernika
    level: string;
    tasks: string[];
  }
) {}

  save(): void {
  // Aktualizuj opis miernika w danych przed zamknięciem
  
    this.dialogRef.close(this.data);
    // Przekazuje dane do tabeli tylko po kliknięciu "Zapisz"
}

close(): void {
  this.dialogRef.close(null); // Nie przekazuje zmian przy zamknięciu okna
}
}
