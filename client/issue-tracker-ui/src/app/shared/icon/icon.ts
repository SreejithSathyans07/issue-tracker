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
  LucideAlertOctagon,
  LucideArrowLeft,
  LucideUsers,
  LucideTag,
  LucideLayers,
  LucidePackage,
  LucideTrash2,
  LucideShield,
  LucideArrowDown,
  LucideArrowUp,
  LucidePencil,
  LucideSearch,
  LucideHelpCircle
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
  'alert-octagon': LucideAlertOctagon,
  'arrow-left': LucideArrowLeft,
  users: LucideUsers,
  tag: LucideTag,
  layers: LucideLayers,
  package: LucidePackage,
  'trash-2': LucideTrash2,
  shield: LucideShield,
  'arrow-down': LucideArrowDown,
  'arrow-up': LucideArrowUp,
  pencil: LucidePencil,
  search: LucideSearch,
  'help-circle': LucideHelpCircle
};

/** Icon names that make sense for a user-facing icon picker (Status/Impact lookup values). */
export const PICKABLE_ICON_NAMES = [
  'circle',
  'refresh-cw',
  'activity',
  'check-circle',
  'x-circle',
  'pause-circle',
  'life-buoy',
  'slash',
  'alert-circle',
  'alert-triangle',
  'zap',
  'alert-octagon',
  'eye',
  'tag',
  'clipboard',
  'shield'
];

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
