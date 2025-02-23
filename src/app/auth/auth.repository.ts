import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserDto } from './user.dto';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api/api-url.token';
import { RegisterUserDto } from './register-user.dto';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = inject(API_URL);

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/api/auth/login`,
      {
        email,
        password,
      }
    );
  }

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/api/auth/user`);
  }

  registerUser(dto: RegisterUserDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/auth/signup`, dto);
  }
}
