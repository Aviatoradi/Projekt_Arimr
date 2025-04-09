import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api/api-url.token';

export interface CreateLogisticApplicationDto {
  applicationPrediction: number;
  applicationCount: number;
  goalId: number;
}

export interface LogisticApplicationDto {
  id: number;
  applicationPrediction: number;
  applicationCount: number;
  editingUserId: number;
  goalId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateLogisticApplicationDto {
  applicationPrediction?: number;
  applicationCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class LogisticApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${inject(API_URL)}/api`;

  getApplicationsByGoalId(departmentId: number, goalId: number): Observable<LogisticApplicationDto[]> {
    return this.http.get<LogisticApplicationDto[]>(`${this.apiUrl}/${departmentId}/logistic-applications/goal/${goalId}`);
  }

  getApplication(departmentId: number, id: number): Observable<LogisticApplicationDto> {
    return this.http.get<LogisticApplicationDto>(`${this.apiUrl}/${departmentId}/logistic-applications/${id}`);
  }

  createApplication(departmentId: number, data: CreateLogisticApplicationDto): Observable<LogisticApplicationDto> {
    return this.http.post<LogisticApplicationDto>(`${this.apiUrl}/${departmentId}/logistic-applications/create`, data);
  }

  updateApplication(departmentId: number, id: number, data: UpdateLogisticApplicationDto): Observable<LogisticApplicationDto> {
    return this.http.put<LogisticApplicationDto>(`${this.apiUrl}/${departmentId}/logistic-applications/${id}`, data);
  }

  deleteApplication(departmentId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${departmentId}/logistic-applications/${id}`);
  }
}
