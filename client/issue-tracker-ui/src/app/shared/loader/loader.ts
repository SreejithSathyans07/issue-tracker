import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <span
      class="twin-orbit"
      role="status"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.color]="color()"
      [style.--duration]="duration()"
    >
      <span class="marker"></span>
      <span class="marker marker-delay"></span>
      <span class="sr-only">Loading</span>
    </span>
  `,
  styles: [
    `
    :host {
      display: inline-flex;
    }
    .twin-orbit {
      position: relative;
      display: inline-block;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      background: currentColor;
    }
    .marker {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: currentColor;
      transform: rotate(0deg) translate(155%);
      animation: twin-orbit-rotate var(--duration, 1s) ease infinite;
    }
    .marker-delay {
      animation-delay: calc(var(--duration, 1s) / 2);
    }
    @keyframes twin-orbit-rotate {
      100% {
        transform: rotate(360deg) translate(155%);
      }
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    `
  ]
})
export class Loader {
  size = input<number>(28);
  color = input<string>('currentColor');
  duration = input<string>('1s');
}
