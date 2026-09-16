import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';
import { ToastContainer } from './shared/toast-container/toast-container';
import { Auth } from './core/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialog, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('issue-tracker-ui');
  private auth = inject(Auth);

  constructor() {
    this.auth.warmup().subscribe();
  }
}
