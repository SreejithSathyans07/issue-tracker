import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent }
];
