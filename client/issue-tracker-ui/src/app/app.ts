import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';
import { ToastContainer } from './shared/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialog, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('issue-tracker-ui');
}
