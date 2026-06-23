import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['../auth.scss', './login.scss']
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  form = {
    email: '',
    password: ''
  };

  submitted = false;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  get emailInvalid(): boolean {
    return this.submitted && (!this.form.email || !this.form.email.includes('@'));
  }

  get passwordInvalid(): boolean {
    return this.submitted && this.form.password.length < 8;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.emailInvalid || this.passwordInvalid) {
      this.errorMessage = 'Please enter a valid email and an 8 character password.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.form).subscribe({
      next: () => {
        this.isLoading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
