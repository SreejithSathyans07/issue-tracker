import { Routes } from '@angular/router';
import { AuthPage } from './features/auth/auth';
import { Landing } from './features/landing/landing';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bugs', pathMatch: 'full' },
  { path: 'login', component: AuthPage },
  { path: 'bugs', component: Landing, canActivate: [authGuard] }
];
