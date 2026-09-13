import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { Auth as AuthService } from '../../core/auth';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'login' | 'signup'>('login');
  showLoginPw = signal(false);
  showSignupPw = signal(false);
  showSignupConfirmPw = signal(false);

  loginError = signal<string | null>(null);
  signupError = signal<string | null>(null);
  signupSuccess = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.fb.group(
    {
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordsMatchValidator }
  );

  switchTab(tab: 'login' | 'signup') {
    this.activeTab.set(tab);
    this.loginError.set(null);
    this.signupError.set(null);
    this.signupSuccess.set(false);
  }

  submitLogin() {
    this.loginError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError.set('Please enter your username and password.');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login({ username: username!, password: password! }).subscribe({
      next: () => {
        this.router.navigate(['/bugs']);
      },
      error: () => {
        this.loginError.set('Incorrect username or password.');
      }
    });
  }

  submitSignup() {
    this.signupError.set(null);
    this.signupSuccess.set(false);

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      if (this.signupForm.errors?.['passwordsMismatch']) {
        this.signupError.set("Passwords don't match.");
      } else {
        this.signupError.set('Please fill in all fields correctly.');
      }
      return;
    }

    const { name, username, password } = this.signupForm.getRawValue();

    this.authService.signup({ name: name!, username: username!, password: password! }).subscribe({
      next: () => {
        this.signupSuccess.set(true);
        this.signupForm.reset();
      },
      error: (err) => {
        this.signupError.set(err.error ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
