import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  async canActivate(): Promise<boolean | UrlTree> {
    const isAuthenticated = await firstValueFrom(
      this.authService.isAuthenticated$
    );

    return isAuthenticated ? true : this.router.createUrlTree(['/login']);
  }
}
