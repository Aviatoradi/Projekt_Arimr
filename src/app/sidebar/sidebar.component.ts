// sidebar.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface NavItem {
  path?: string;
  icon: string;
  label: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule,
    MatButton,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  readonly user = toSignal(this.authService.user$, { requireSync: true });

  // Store expanded state for each parent item
  expandedItems = signal<Set<string>>(new Set());

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

  readonly adminItems: NavItem[] = [
    {
      icon: 'admin_panel_settings',
      label: 'Panel administratora',
      children: [
        {
          path: '/app/admin/goals',
          icon: 'flag',
          label: 'Cele',
        },
        {
          path: '/app/admin/programs',
          icon: 'map',
          label: 'Programy',
        },
        {
          path: '/app/admin/interventions',
          icon: 'travel_explore',
          label: 'Interwencje',
        },
        {
          path: '/app/admin/intakes',
          icon: 'calendar_month',
          label: 'Nabory',
        },
      ],
    },
  ];

  readonly navigationItems = computed<NavItem[]>(() => {
    const user = this.user();

    if (user?.role === 'admin') {
      return [...this._navigationItems, ...this.adminItems];
    }

    return this._navigationItems;
  });

  toggleExpand(path: string): void {
    const expanded = this.expandedItems();
    const newExpanded = new Set(expanded);

    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }

    this.expandedItems.set(newExpanded);
  }

  isExpanded(path: string): boolean {
    return this.expandedItems().has(path);
  }

  logout() {
    this.authService.logout();
  }
}
