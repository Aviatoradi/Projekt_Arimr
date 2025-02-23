import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from "@angular/material/button";

interface NavItem {
  path: string;
  icon: string;
  label: string;
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule, MatButton],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  readonly user = toSignal(this.authService.user$);

  navigationItems: NavItem[] = [
    {
      path: '/dashboard',
      icon: 'dashboard',
      label: 'Dashboard'
    },
    {
      path: '/goals',
      icon: 'flag',
      label: 'Cele'
    },
    {
      path: '/custom-goal',
      icon: 'assignment',
      label: 'Dodaj swój cel'
    },
    {
      path: '/tasks',
      icon: 'settings',
      label: 'Podsumowanie'
    }
  ];
  logout() {
    this.authService.logout();
  }
}
