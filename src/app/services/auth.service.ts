import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthRepository } from '../auth/auth.repository';
import { CookieService } from 'ngx-cookie-service';
import { UserDto } from '../auth/user.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated$ = new BehaviorSubject(false);

  readonly user$ = new BehaviorSubject<UserDto | null>(null);

  readonly authenticating$ = new BehaviorSubject(false);

  private readonly repository = inject(AuthRepository);

  private readonly cookieService = inject(CookieService);

  private readonly router = inject(Router);

  setCurrentUser(): Observable<void> {
    if (!this.getAuthToken()) {
      return of(void 0);
    }

    return this.repository.getCurrentUser().pipe(
      tap({
        next: (dto) => {
          this.isAuthenticated$.next(true);
          this.user$.next(dto);
        },
        error: (err) => {
          this.router.navigate(['/login']);
        },
      }),
      map(() => void 0)
    );
  }

  login(username: string, password: string): Observable<void> {
    this.authenticating$.next(true);
    return this.repository.login(username, password).pipe(
      tap({
        next: ({ accessToken }) => {
          this.cookieService.set('Auth-Token', accessToken, {
            path: '/',
          });
        },
      }),
      switchMap(() => {
        return this.setCurrentUser();
      })
    );
  }

  private getAuthToken(): string | null {
    return this.cookieService.get('Auth-Token');
  }

  logout(): void {
    this.isAuthenticated$.next(false);
    this.user$.next(null);
    this.cookieService.delete('Auth-Token', '/');
    this.router.navigate(['/login']);
  }
}
