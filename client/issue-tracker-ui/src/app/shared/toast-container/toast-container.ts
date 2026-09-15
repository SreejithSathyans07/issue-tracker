import { Component, inject } from '@angular/core';
import { Icon } from '../icon/icon';
import { Toast, ToastVariant } from '../../core/toast';

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: 'check-circle',
  error: 'alert-circle',
  info: 'info'
};

@Component({
  selector: 'app-toast-container',
  imports: [Icon],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css'
})
export class ToastContainer {
  protected toast = inject(Toast);

  icon(variant: ToastVariant) {
    return VARIANT_ICON[variant];
  }
}
