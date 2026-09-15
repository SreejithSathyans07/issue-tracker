import { Injectable, signal } from '@angular/core';

export type ConfirmVariant = 'confirm' | 'danger' | 'success' | 'info';

export interface ConfirmOptions {
  variant?: ConfirmVariant;
  title: string;
  message: string;
  okLabel?: string;
  hideCancel?: boolean;
}

export interface ConfirmState extends ConfirmOptions {
  variant: ConfirmVariant;
  okLabel: string;
  hideCancel: boolean;
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class Confirm {
  state = signal<ConfirmState | null>(null);

  ask(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.set({
        variant: options.variant ?? 'confirm',
        title: options.title,
        message: options.message,
        okLabel: options.okLabel ?? 'OK',
        hideCancel: options.hideCancel ?? false,
        resolve
      });
    });
  }

  /** A single-button informational alert (e.g. surfacing a failed action's reason). */
  alert(options: Omit<ConfirmOptions, 'variant' | 'hideCancel'>): Promise<void> {
    return this.ask({ ...options, variant: 'info', hideCancel: true }).then(() => undefined);
  }

  respond(result: boolean) {
    this.state()?.resolve(result);
    this.state.set(null);
  }
}
