import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environents/environment';
import { GoalDto } from '../admin/dtos';

@Injectable({
  providedIn: 'root',
})
export class LogisticGoalsService {
  private apiUrl = `${environment.apiUrl}/api/goals`;

  constructor(private http: HttpClient) {}

  getLogisticGoals(): Observable<GoalDto[]> {
    return this.http.get<GoalDto[]>(`${this.apiUrl}/logistic`);
  }

  getLogisticGoalsByDepartmentId(departmentId: number): Observable<GoalDto[]> {
    return this.http.get<GoalDto[]>(`${this.apiUrl}/department/${departmentId}/logistic`);
  }

  createLogisticGoal(goal: { name: string; measure: string; departmentId: number }): Observable<GoalDto> {
    return this.http.post<GoalDto>(`${this.apiUrl}/logistic`, {
      ...goal,
      isTemplate: false,
    });
  }

  getGoalDetails(goalId: number): Observable<GoalDto> {
    return this.http.get<GoalDto>(`${this.apiUrl}/${goalId}`);
  }
}
