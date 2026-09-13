import { Routes } from '@angular/router';
import { AuthPage } from './features/auth/auth';
import { Landing } from './features/landing/landing';
import { Admin } from './features/admin/admin';
import { authGuard, adminGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bugs', pathMatch: 'full' },
  { path: 'login', component: AuthPage },
  { path: 'bugs', component: Landing, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] }
];
