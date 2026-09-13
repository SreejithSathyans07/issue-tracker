import { Component, input } from '@angular/core';
import type { LucideIcon } from '@lucide/angular';
import {
  LucideDynamicIcon,
  LucideUser,
  LucideLock,
  LucideEye,
  LucideEyeOff,
  LucideAtSign,
  LucideClipboardList,
  LucideAlertCircle,
  LucideCheckCircle2,
  LucidePlus,
  LucideChevronDown,
  LucideX,
  LucideCheck,
  LucideSettings,
  LucideLogOut,
  LucideCircle,
  LucideRefreshCw,
  LucideActivity,
  LucideXCircle,
  LucidePauseCircle,
  LucideLifeBuoy,
  LucideSlash,
  LucideAlertTriangle,
  LucideZap,
  LucideAlertOctagon
} from '@lucide/angular';

const ICONS: Record<string, LucideIcon> = {
  user: LucideUser,
  lock: LucideLock,
  eye: LucideEye,
  'eye-off': LucideEyeOff,
  'at-sign': LucideAtSign,
  clipboard: LucideClipboardList,
  'alert-circle': LucideAlertCircle,
  'check-circle': LucideCheckCircle2,
  plus: LucidePlus,
  'chevron-down': LucideChevronDown,
  x: LucideX,
  check: LucideCheck,
  settings: LucideSettings,
  'log-out': LucideLogOut,
  circle: LucideCircle,
  'refresh-cw': LucideRefreshCw,
  activity: LucideActivity,
  'x-circle': LucideXCircle,
  'pause-circle': LucidePauseCircle,
  'life-buoy': LucideLifeBuoy,
  slash: LucideSlash,
  'alert-triangle': LucideAlertTriangle,
  zap: LucideZap,
  'alert-octagon': LucideAlertOctagon
};

@Component({
  selector: 'app-icon',
  imports: [LucideDynamicIcon],
  template: `<svg [lucideIcon]="icon()" [size]="size()"></svg>`,
  styles: [':host { display: inline-flex; line-height: 0; }']
})
export class Icon {
  name = input.required<string>();
  size = input<number>(15);

  protected icon() {
    return ICONS[this.name()] ?? null;
  }
}
