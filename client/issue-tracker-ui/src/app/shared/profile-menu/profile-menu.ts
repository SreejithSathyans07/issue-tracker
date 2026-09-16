import { Component, HostListener, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../icon/icon';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-profile-menu',
  imports: [Icon],
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.css'
})
export class ProfileMenu {
  protected auth = inject(Auth);
  private router = inject(Router);

  hideConfigLink = input(false);

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen.set(false);
  }

  initials(name: string | undefined): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
