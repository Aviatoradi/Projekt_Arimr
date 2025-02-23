import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { inject, provideAppInitializer } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { API_URL } from './app/api/api-url.token';
import { environment } from './environents/environment';
import { AuthService } from './app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

function setBearer(
  req: HttpRequest<any>,
  token: string | undefined
): HttpRequest<any> {
  if (!token) {
    return req;
  }
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const jwtTokenInterceptor: HttpInterceptorFn = (
  httpRequest: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const cookieService = inject(CookieService);

  const token = cookieService.get('Auth-Token');

  if (!token) {
    return next(httpRequest);
  }

  return next(setBearer(httpRequest, token));
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtTokenInterceptor])),
    provideAnimations(),
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(authService.setCurrentUser());
    }),
  ],
}).catch((err) => console.error(err));
