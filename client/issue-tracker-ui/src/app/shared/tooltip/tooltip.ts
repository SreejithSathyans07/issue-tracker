import { Directive, ElementRef, HostListener, Renderer2, inject, input } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class Tooltip {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private tooltipEl: HTMLElement | null = null;

  appTooltip = input<string>('');
  appTooltipLabel = input<string>('');

  @HostListener('mouseenter')
  show() {
    const text = this.appTooltip();
    if (!text) return;

    const tooltip = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(tooltip, 'app-tooltip');

    const label = this.appTooltipLabel();
    if (label) {
      const labelEl = this.renderer.createElement('span') as HTMLElement;
      this.renderer.addClass(labelEl, 'app-tooltip-label');
      this.renderer.appendChild(labelEl, this.renderer.createText(label));
      this.renderer.appendChild(tooltip, labelEl);
    }

    const textEl = this.renderer.createElement('span') as HTMLElement;
    this.renderer.appendChild(textEl, this.renderer.createText(text));
    this.renderer.appendChild(tooltip, textEl);

    this.renderer.appendChild(document.body, tooltip);
    this.tooltipEl = tooltip;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();

    let left = hostRect.right + 14;
    let flipped = false;
    if (left + tipRect.width > window.innerWidth - 8) {
      left = hostRect.left - tipRect.width - 14;
      flipped = true;
    }
    this.renderer.setStyle(tooltip, 'left', `${Math.max(8, left)}px`);
    this.renderer.addClass(tooltip, flipped ? 'app-tooltip-left' : 'app-tooltip-right');

    let top = hostRect.top;
    if (top + tipRect.height > window.innerHeight - 8) {
      top = window.innerHeight - tipRect.height - 8;
    }
    this.renderer.setStyle(tooltip, 'top', `${Math.max(8, top)}px`);
  }

  @HostListener('mouseleave')
  @HostListener('click')
  hide() {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
