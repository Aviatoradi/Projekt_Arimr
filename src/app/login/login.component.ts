import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton, MatIconButton } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    NgIf,
    MatCheckbox,
    MatButton,
    MatError,
    MatLabel,
    MatIconButton,
  ],
  standalone: true,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: () => this.router.navigate(['/app']),
        });
    } else {
      this.snackBar.open(
        'Please fill in all required fields correctly',
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }

  getErrorMessage(field: string): string {
    if (this.loginForm.get(field)?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'email' && this.loginForm.get('email')?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (
      field === 'password' &&
      this.loginForm.get('password')?.hasError('minlength')
    ) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }
}
