import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; // ✅ FormsModule dla ngModel
import { CommonModule } from '@angular/common'; // ✅ CommonModule dla ngIf

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Używamy standalone component
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule] // ✅ Naprawione: dodane FormsModule i CommonModule!
})
  
  
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']); // ✅ Przekierowanie po zalogowaniu
    } else {
      this.errorMessage = 'Nieprawidłowy login lub hasło';
    }
  }
}
