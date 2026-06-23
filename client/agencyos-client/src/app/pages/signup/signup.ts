import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['../auth.scss', '../login/login.scss']
})
export class SignupComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  form = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  submitted = false;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  get nameInvalid(): boolean {
    return this.submitted && this.form.name.trim().length < 2;
  }

  get emailInvalid(): boolean {
    return this.submitted && (!this.form.email || !this.form.email.includes('@'));
  }

  get passwordInvalid(): boolean {
    return this.submitted && this.form.password.length < 8;
  }

  get confirmPasswordInvalid(): boolean {
    return this.submitted && this.form.confirmPassword !== this.form.password;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.nameInvalid || this.emailInvalid || this.passwordInvalid || this.confirmPasswordInvalid) {
      this.errorMessage = 'Please fix the highlighted fields before continuing.';
      return;
    }

    this.isLoading = true;

    const { confirmPassword: _confirmPassword, ...signupData } = this.form;

    this.authService.signup(signupData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
