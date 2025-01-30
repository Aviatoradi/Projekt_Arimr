import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportService {


  
  exportToExcel(data: any[]): void {
    console.log('🔹 Eksportowanie danych:', data); // Sprawdzenie w konsoli, czy metoda się uruchamia


    // Nagłówki arkusza
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['Lp.', 'Cel', 'Mierniki określające stopień realizacji celu', '', 'Najważniejsze zadania służące realizacji celu', 'Komórka której dotyczy miernik'],
      ['', '', 'Nazwa i sposób obliczania miernika (algorytm)', 'Planowana wartość do osiągnięcia na koniec 2025 r.', '', ''],
    ]);

    // Wstawianie danych do arkusza
    const formattedData = data.map((item, index) => [
      index + 1, // Lp.
      item.goal, // Cel
      `${item.metricName}\n${item.metricDescription}`, // Nazwa i opis miernika (zawijanie tekstu)
      item.plannedValue, // Planowana wartość
      item.tasks && Array.isArray(item.tasks) ? item.tasks.join('\n• ') : 'Brak zadań', // Pobieranie zadań, oddzielone punktorami
      item.department, // Komórka której dotyczy miernik
    ]);

    XLSX.utils.sheet_add_aoa(ws, formattedData, { origin: -1 });

    // Formatowanie nagłówków (scalanie komórek)
    ws['!merges'] = [
      { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } }, // Scalanie "Mierniki"
      { s: { r: 1, c: 2 }, e: { r: 1, c: 3 } }, // Scalanie "Nazwa miernika"
    ];

    // Ustawienia szerokości kolumn (dopasowane do struktury)
    ws['!cols'] = [
      { wch: 5 },  // Lp.
      { wch: 40 }, // Cel
      { wch: 50 }, // Miernik
      { wch: 15 }, // Wartość
      { wch: 60 }, // Zadania
      { wch: 10 }, // Komórka
    ];

    // Formatowanie wierszy dla lepszej czytelności (zawijanie tekstu w odpowiednich kolumnach)
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let row = range.s.r + 2; row <= range.e.r; row++) {
      ['B', 'C', 'D', 'E'].forEach((col) => {
        const cellAddress = `${col}${row + 1}`;
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            alignment: { wrapText: true, vertical: 'top' },
          };
        }
      });
    }

    // Tworzenie pliku Excela
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cele ARiMR 2025');

    // Zapis do pliku
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Cele_ARiMR_2025.xlsx');

    console.log('✅ Eksport zakończony');
  }
}
