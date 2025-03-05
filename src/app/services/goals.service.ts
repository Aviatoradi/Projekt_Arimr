// src/app/core/services/goal.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateGoalDto, GoalDto, UpdateGoalDto } from '../admin/dtos';
import { API_URL } from '../api/api-url.token';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private apiUrl = `${inject(API_URL)}/api/goals`;

  constructor(private http: HttpClient) {}

  getAllGoals(): Observable<GoalDto[]> {
    return this.http.get<GoalDto[]>(this.apiUrl);
  }


  getGoalTemplates(): Observable<GoalDto[]> {
    return this.http.get<GoalDto[]>(`${this.apiUrl}/templates`);
  }

  getGoalById(id: number): Observable<GoalDto> {
    return this.http.get<GoalDto>(`${this.apiUrl}/${id}`);
  }

  getGoalWithRelations(id: number): Observable<GoalDto> {
    return this.http.get<GoalDto>(`${this.apiUrl}/${id}/with-relations`);
  }

  createGoal(goal: CreateGoalDto): Observable<GoalDto> {
    return this.http.post<GoalDto>(this.apiUrl, goal);
  }

  updateGoal(id: number, goal: UpdateGoalDto): Observable<GoalDto> {
    return this.http.patch<GoalDto>(`${this.apiUrl}/${id}`, goal);
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createFromTemplate(
    templateId: number,
    departmentId: number
  ): Observable<GoalDto> {
    const params = new HttpParams()
      .set('templateId', templateId.toString())
      .set('departmentId', departmentId.toString());

    return this.http.post<GoalDto>(
      `${this.apiUrl}/from-template`,
      {},
      { params }
    );
  }
}
