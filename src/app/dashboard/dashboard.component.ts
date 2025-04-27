import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DepartmentsComponent } from '../components/departments/departments.component';
import { API_URL } from '../api/api-url.token';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [
    DepartmentsComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgIf,
  ],
  //styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);

  readonly excelExportUrl = `${this.apiUrl}/api/departments/export/excel`;
  isDownloading = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  downloadExcel(): void {
    this.isDownloading.set(true);

    this.http.get(this.excelExportUrl, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'departments-export.xlsx';
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloading.set(false);
      },
      error: (error) => {
        console.error('Error downloading Excel file:', error);
        this.isDownloading.set(false);
        alert('Nie udało się pobrać pliku Excel. Spróbuj ponownie później.');
      },
    });
  }

  navigateTo(section: string) {
    if (section === 'centrala') {
      this.router.navigate(['/goals']);
    } else if (section === 'or') {
      this.router.navigate(['/tasks']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
