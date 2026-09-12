import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth';
import { LandingComponent } from './features/landing/landing';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bugs', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'bugs', component: LandingComponent, canActivate: [authGuard] }
];
