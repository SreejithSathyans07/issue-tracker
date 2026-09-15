import { Component, inject } from '@angular/core';
import { Icon } from '../icon/icon';
import { Confirm, ConfirmVariant } from '../../core/confirm';

const VARIANT_META: Record<ConfirmVariant, { icon: string; okIcon: string; okClass: string }> = {
  confirm: { icon: 'help-circle', okIcon: 'check', okClass: 'btn-primary' },
  danger: { icon: 'alert-triangle', okIcon: 'trash-2', okClass: 'btn-danger' },
  success: { icon: 'check-circle', okIcon: 'check', okClass: 'btn-primary' }
};

@Component({
  selector: 'app-confirm-dialog',
  imports: [Icon],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog {
  protected confirm = inject(Confirm);

  meta(variant: ConfirmVariant) {
    return VARIANT_META[variant];
  }

  respond(result: boolean) {
    this.confirm.respond(result);
  }
}
