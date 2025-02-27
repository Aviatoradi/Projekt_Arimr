import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environents/environment';
import { DepartmentDto } from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private apiUrl = `${environment.apiUrl}/api/departments`;

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(`${this.apiUrl}/all`);
  }

  getMyDepartments(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(`${this.apiUrl}/my`);
  }

  getDepartmentById(id: number): Observable<DepartmentDto> {
    return this.http.get<DepartmentDto>(`${this.apiUrl}/${id}`);
  }

  // createDepartment(department: CreateDepartmentDto): Observable<DepartmentDto> {
  //   return this.http.post<DepartmentDto>(this.apiUrl, department);
  // }
  //
  // updateDepartment(id: number, department: UpdateDepartmentDto): Observable<DepartmentDto> {
  //   return this.http.patch<DepartmentDto>(`${this.apiUrl}/${id}`, department);
  // }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDepartmentWithGoals(id: number): Observable<DepartmentDto> {
    return this.http.get<DepartmentDto>(`${this.apiUrl}/${id}/with-goals`);
  }

  addUserToDepartment(departmentId: number, userId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${departmentId}/users/${userId}`,
      {}
    );
  }

  removeUserFromDepartment(
    departmentId: number,
    userId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${departmentId}/users/${userId}`
    );
  }
}
