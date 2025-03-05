import { Injectable, computed, inject, signal } from '@angular/core';
import {
  ProgramDto,
  CreateProgramDto,
  UpdateProgramDto,
  GoalDto,
} from '../admin/dtos';
import { catchError, finalize, tap } from 'rxjs/operators';
import { map, Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpAbstract } from '../core/http-abstract';

@Injectable()
export class ProgramsService extends HttpAbstract {
  private readonly programsUrl = `${this.apiUrl}/api/programs`;
  private readonly goalsUrl = `${this.apiUrl}/api/goals`;

  private _programs = signal<ProgramDto[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _selectedProgram = signal<ProgramDto | null>(null);
  private _availableGoals = signal<GoalDto[]>([]);

  public programs = this._programs.asReadonly();
  public loading = this._loading.asReadonly();
  public error = this._error.asReadonly();
  public selectedProgram = this._selectedProgram.asReadonly();
  public availableGoals = this._availableGoals.asReadonly();

  loadPrograms(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<ProgramDto[]>(this.programsUrl)
      .pipe(
        tap((programs) => this._programs.set(programs)),
        catchError(this.handleError('Błąd podczas pobierania programów')),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }

  loadAvailableGoals(): void {
    this._loading.set(true);

    this.http
      .get<GoalDto[]>(this.goalsUrl)
      .pipe(
        tap((goals) => this._availableGoals.set(goals)),
        catchError(this.handleError('Błąd podczas pobierania celów')),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }

  getProgram(id: number): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<ProgramDto>(`${this.programsUrl}/${id}`)
      .pipe(
        tap((program) => this._selectedProgram.set(program)),
        catchError(this.handleError('Błąd podczas pobierania programu')),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }

  createProgram(program: CreateProgramDto): Observable<ProgramDto | null> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<ProgramDto>(this.programsUrl, program).pipe(
      tap((newProgram) => {
        const currentPrograms = this._programs();
        this._programs.set([...currentPrograms, newProgram]);
      }),
      catchError(
        this.handleError<ProgramDto>('Błąd podczas tworzenia programu')
      ),
      finalize(() => this._loading.set(false))
    );
  }

  updateProgram(
    id: number,
    program: UpdateProgramDto
  ): Observable<ProgramDto | null> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .patch<ProgramDto>(`${this.programsUrl}/${id}`, program)
      .pipe(
        tap((updatedProgram) => {
          const currentPrograms = this._programs();
          this._programs.set(
            currentPrograms.map((p) => (p.id === id ? updatedProgram : p))
          );
          if (this._selectedProgram()?.id === id) {
            this._selectedProgram.set(updatedProgram);
          }
        }),
        catchError(
          this.handleError<ProgramDto>('Błąd podczas aktualizacji programu')
        ),
        finalize(() => this._loading.set(false))
      );
  }

  deleteProgram(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.programsUrl}/${id}`).pipe(
      tap(() => {
        const currentPrograms = this._programs();
        this._programs.set(currentPrograms.filter((p) => p.id !== id));
        if (this._selectedProgram()?.id === id) {
          this._selectedProgram.set(null);
        }
      }),
      map(() => void 0),
      catchError((error) => {
        this.handleErrorMessage('Błąd podczas usuwania programu', error);
        return of(false);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  resetSelectedProgram(): void {
    this._selectedProgram.set(null);
  }

  private handleError<T>(
    operation: string
  ): (error: any) => Observable<T | null> {
    return (error: any): Observable<T | null> => {
      this.handleErrorMessage(operation, error);
      return of(null);
    };
  }

  private handleErrorMessage(operation: string, error: any): void {
    let errorMessage = `${operation}`;

    if (error instanceof HttpErrorResponse) {
      errorMessage += `: ${error.status} ${error.statusText}`;
      if (error.error?.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    } else {
      errorMessage += `: ${error.message}`;
    }

    this._error.set(errorMessage);
    console.error(errorMessage, error);
  }
}
