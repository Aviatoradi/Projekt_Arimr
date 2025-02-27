import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';

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

  private readonly _navigationItems: NavItem[] = [
    {
      path: '/app/dashboard',
      icon: 'dashboard',
      label: 'Dashboard',
    },
    {
      path: '/app/goals',
      icon: 'flag',
      label: 'Cele',
    },
    {
      path: '/app/custom-goal',
      icon: 'assignment',
      label: 'Dodaj swój cel',
    },
    {
      path: '/app/tasks',
      icon: 'settings',
      label: 'Podsumowanie',
    },
  ];
  readonly navigationItems = computed<NavItem[]>(() => {
    const user = this.user();

    if (user?.role == 'admin') {
      return [
        ...this._navigationItems,
        {
          path: '/admin',
          icon: 'admin_panel_settings',
          label: 'Panel administratora',
        },
      ];
    }

    return this._navigationItems;
  });

  logout() {
    this.authService.logout();
  }
}
