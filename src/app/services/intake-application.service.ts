import { Injectable } from '@angular/core';
import { HttpAbstract } from '../core/http-abstract';
import { CreateIntakeApplicationDto } from '../admin/dtos';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IntakeApplicationService extends HttpAbstract {
  create(intake: CreateIntakeApplicationDto): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/api/${intake.departmentId}/intake-applications/create`,
      intake
    );
  }
}
