import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { Loader } from '../../shared/loader/loader';
import { Auth as AuthService } from '../../core/auth';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, Icon, Loader],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = signal<'login' | 'signup'>('login');
  showLoginPw = signal(false);
  showSignupPw = signal(false);
  showSignupConfirmPw = signal(false);

  loginError = signal<string | null>(
    this.route.snapshot.queryParamMap.get('sessionExpired') ? 'Your session has expired. Please log in again.' : null
  );
  signupError = signal<string | null>(null);
  signupSuccess = signal(false);

  loggingIn = signal(false);
  signingUp = signal(false);
  slowLogin = signal(false);
  slowSignup = signal(false);

  private loginWarmupTimer?: ReturnType<typeof setTimeout>;
  private signupWarmupTimer?: ReturnType<typeof setTimeout>;

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.maxLength(100)]]
  });

  signupForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(USERNAME_PATTERN)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
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

  fieldError(form: FormGroup, field: string): string | null {
    const control = form.get(field);
    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['maxlength']) return `Must be ${control.errors['maxlength'].requiredLength} characters or fewer.`;
    if (control.errors['minlength']) return `Must be at least ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['pattern']) return 'Letters, numbers, and underscores only.';
    return null;
  }

  submitLogin() {
    this.loginError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError.set('Please enter your username and password.');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.loggingIn.set(true);
    this.slowLogin.set(false);
    this.loginWarmupTimer = setTimeout(() => this.slowLogin.set(true), 3000);

    this.authService.login({ username: username!, password: password! }).subscribe({
      next: () => {
        clearTimeout(this.loginWarmupTimer);
        this.router.navigate(['/bugs']);
      },
      error: () => {
        clearTimeout(this.loginWarmupTimer);
        this.loggingIn.set(false);
        this.slowLogin.set(false);
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
    this.signingUp.set(true);
    this.slowSignup.set(false);
    this.signupWarmupTimer = setTimeout(() => this.slowSignup.set(true), 3000);

    this.authService.signup({ name: name!, username: username!, password: password! }).subscribe({
      next: () => {
        clearTimeout(this.signupWarmupTimer);
        this.signingUp.set(false);
        this.slowSignup.set(false);
        this.signupSuccess.set(true);
        this.signupForm.reset();
      },
      error: (err) => {
        clearTimeout(this.signupWarmupTimer);
        this.signingUp.set(false);
        this.slowSignup.set(false);
        this.signupError.set(err.error ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
