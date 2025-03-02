// intervention.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpAbstract } from '../../core/http-abstract';
import {
  CreateIntakeDto,
  CreateInterventionDto,
  IntakeDto,
  InterventionDto,
  UpdateIntakeDto,
  UpdateInterventionDto,
} from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class InterventionService extends HttpAbstract {
  // Endpoints
  private readonly interventionsEndpoint = `${this.apiUrl}/api/interventions`;
  private readonly intakesEndpoint = `${this.apiUrl}/api/intakes`;

  // Intervention CRUD operations
  getInterventions(): Observable<InterventionDto[]> {
    return this.http.get<InterventionDto[]>(this.interventionsEndpoint);
  }

  getInterventionById(id: number): Observable<InterventionDto> {
    return this.http.get<InterventionDto>(
      `${this.interventionsEndpoint}/${id}`
    );
  }

  createIntervention(
    intervention: CreateInterventionDto
  ): Observable<InterventionDto> {
    return this.http.post<InterventionDto>(
      this.interventionsEndpoint,
      intervention
    );
  }

  updateIntervention(
    id: number,
    intervention: UpdateInterventionDto
  ): Observable<InterventionDto> {
    return this.http.patch<InterventionDto>(
      `${this.interventionsEndpoint}/${id}`,
      intervention
    );
  }

  deleteIntervention(id: number): Observable<void> {
    return this.http.delete<void>(`${this.interventionsEndpoint}/${id}`);
  }

  // Intake operations
  getIntakes(): Observable<IntakeDto[]> {
    return this.http.get<IntakeDto[]>(this.intakesEndpoint);
  }

  getIntakesByInterventionId(interventionId: number): Observable<IntakeDto[]> {
    return this.http
      .get<{
        intakes: IntakeDto[];
      }>(`${this.interventionsEndpoint}/${interventionId}`)
      .pipe(map(({ intakes }) => intakes));
  }

  createIntake(intake: CreateIntakeDto): Observable<IntakeDto> {
    return this.http.post<IntakeDto>(this.intakesEndpoint, intake);
  }

  getIntakeById(id: number): Observable<IntakeDto> {
    return this.http.get<IntakeDto>(`${this.intakesEndpoint}/${id}`);
  }

  updateIntake(id: number, intake: UpdateIntakeDto): Observable<IntakeDto> {
    return this.http.patch<IntakeDto>(`${this.intakesEndpoint}/${id}`, intake);
  }

  deleteIntake(id: number): Observable<void> {
    return this.http.delete<void>(`${this.intakesEndpoint}/${id}`);
  }
}
