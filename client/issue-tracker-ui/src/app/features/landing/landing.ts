import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-landing',
  template: `
    <div style="padding: 24px; font-family: sans-serif;">
      <p>Logged in as <strong>{{ auth.getUser()?.name }}</strong> ({{ auth.getUser()?.username }})</p>
      <p><em>Landing page UI comes in Stage 8 — this is a placeholder to verify the login redirect and route guard.</em></p>
      <button (click)="logout()">Log Out</button>
    </div>
  `
})
export class LandingComponent {
  protected auth = inject(Auth);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
