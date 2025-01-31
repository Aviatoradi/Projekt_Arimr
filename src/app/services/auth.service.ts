import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: string | null = null;

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'password') { 
      this.loggedInUser = username;
      localStorage.setItem('loggedInUser', username); // ✅ Przechowujemy sesję użytkownika
      return true;
    }
    return false;
  }

  getLoggedInUser(): string | null {
    return localStorage.getItem('loggedInUser'); // ✅ Pobieramy użytkownika z localStorage
  }

  logout(): void {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser'); // ✅ Usuwamy sesję użytkownika
  }
}
