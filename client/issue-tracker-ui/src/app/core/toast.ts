import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  variant: ToastVariant;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class Toast {
  toasts = signal<ToastMessage[]>([]);
  private nextId = 0;

  private show(message: string, variant: ToastVariant, durationMs: number) {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, variant, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  success(message: string, durationMs = 3500) {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs = 5000) {
    this.show(message, 'error', durationMs);
  }

  info(message: string, durationMs = 3500) {
    this.show(message, 'info', durationMs);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
