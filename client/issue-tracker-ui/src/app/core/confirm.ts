import { Injectable, signal } from '@angular/core';

export type ConfirmVariant = 'confirm' | 'danger' | 'success';

export interface ConfirmOptions {
  variant?: ConfirmVariant;
  title: string;
  message: string;
  okLabel?: string;
}

export interface ConfirmState extends ConfirmOptions {
  variant: ConfirmVariant;
  okLabel: string;
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
        resolve
      });
    });
  }

  respond(result: boolean) {
    this.state()?.resolve(result);
    this.state.set(null);
  }
}
