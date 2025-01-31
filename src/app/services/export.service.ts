import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  
  /**
   * Eksportuje dane do pliku Excel.
   * @param data - Lista obiektów zawierających dane do eksportu.
   */
  exportToExcel(data: any[]): void {
    console.log('🔹 Eksportowanie danych:', data);

    // 📌 Nagłówki arkusza Excel - poprawione formatowanie dla planowanej wartości
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['', 'Lp.', 'Cel', 'Mierniki określające stopień realizacji celu', '', 'Planowana wartość do osiągnięcia na koniec 2025 r.', 'Najważniejsze zadania służące realizacji celu', 'Komórka której dotyczy miernik'],
      ['', '', '', 'Nazwa i sposób obliczania miernika (algorytm)', '', '', '', ''],
    ]);

    // 📌 Tworzenie listy danych do eksportu
    const formattedData = data.map((item: any, index: number) => {
      console.log(`🛠 Sprawdzam tasks dla celu: ${item.goal}`, item.tasks);

      // 🔹 Formatowanie zadań (tasks)
      let formattedTasks = 'Brak zadań';
      if (item.tasks) {
        if (Array.isArray(item.tasks)) {
          formattedTasks = item.tasks.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n');
        } else if (typeof item.tasks === 'string' && item.tasks.trim() !== '') {
          formattedTasks = item.tasks;
        }
      }

      return [
        '', // Przesunięcie kolumny w prawo, aby nagłówki były wyrównane
        index + 1, // Lp.
        item.goal || 'Brak celu', // Cel
        `${item.metricName}\n${item.metricDescription || 'Brak opisu'}`, // Nazwa i opis miernika
        '', // Pusta kolumna (dla poprawienia struktury)
        item.level || 'Brak wartości', // 📌 Planowana wartość
        formattedTasks, // Zadania
        item.department || 'Brak departamentu', // Komórka której dotyczy miernik
      ];
    });

    // 📌 Wstawienie sformatowanych danych do arkusza Excel
    XLSX.utils.sheet_add_aoa(ws, formattedData, { origin: -1 });

    // 📌 Poprawione scalanie komórek, aby nagłówki były poprawnie ułożone
    ws['!merges'] = [
      { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } }, // Scalanie "Mierniki określające stopień realizacji celu"
      { s: { r: 1, c: 3 }, e: { r: 1, c: 4 } }, // Scalanie "Nazwa i sposób obliczania miernika"
    ];

    // 📌 Ustawienia szerokości kolumn dla lepszego wyglądu Excela
    ws['!cols'] = [
      { wch: 5 },  // Pusta kolumna dla przesunięcia
      { wch: 5 },  // Lp.
      { wch: 40 }, // Cel
      { wch: 50 }, // Miernik
      { wch: 5 },  // Pusta kolumna dla poprawnego formatowania
      { wch: 15 }, // 📌 Planowana wartość
      { wch: 60 }, // Zadania
      { wch: 10 }, // Komórka (Departament)
    ];

    // 📌 Tworzenie pliku Excela
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cele ARiMR 2025');

    // 📌 Zapis do pliku Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Cele_ARiMR_2025.xlsx');

    console.log('✅ Eksport zakończony');
  }
}
