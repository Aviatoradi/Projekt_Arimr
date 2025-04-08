import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api/api-url.token';

export interface Task {
  id: number;
  name: string;
  goalId: number;
  createdAt: string;
  updatedAt: string;
  createdById?: number;
  createdBy?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface CreateTaskDto {
  name: string;
  goalId: number;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = `${inject(API_URL)}/tasks`;

  getTasksByGoalId(goalId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/goal/${goalId}`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${id}`);
  }
}
