import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api/api-url.token';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Department } from './department';

@Injectable({ providedIn: 'root' })
export class DepartmentsRepository {
  private readonly apiUrl = inject(API_URL);

  private readonly client = inject(HttpClient);

  constructor() {}

  getCurrentUserDepartments(): Promise<Department[]> {
    return firstValueFrom(
      this.client.get<Department[]>(`${this.apiUrl}/api/departments/my`)
    );
  }

  getOneDepartment(id: number): Promise<Department> {
    return firstValueFrom(
      this.client.get<Department>(`${this.apiUrl}/api/departments/${id}`)
    );
  }
}
