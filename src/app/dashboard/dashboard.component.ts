import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DepartmentsComponent } from "../departments/departments.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [DepartmentsComponent],
  //styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateTo(section: string) {
    if (section === 'centrala') {
      this.router.navigate(['/goals']); // ✅ Przekierowanie do goal-editor
    } else if (section === 'or') {
      this.router.navigate(['/tasks']); // ✅ Możesz zmienić ścieżkę na odpowiednią dla OR
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // 🚨 Przekierowanie do logowania po wylogowaniu
  }
}
