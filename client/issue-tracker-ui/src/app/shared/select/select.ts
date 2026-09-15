import { Component, HostListener, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon } from '../icon/icon';

export interface SelectOption {
  value: number | string;
  label: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-select',
  imports: [Icon],
  templateUrl: './select.html',
  styleUrl: './select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true
    }
  ]
})
export class Select implements ControlValueAccessor {
  options = input.required<SelectOption[]>();
  placeholder = input('Select...');

  open = signal(false);
  value = signal<number | string | null>(null);
  disabled = signal(false);

  private onChange: (value: number | string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | string | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: number | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selectedOption(): SelectOption | null {
    return this.options().find((o) => o.value === this.value()) ?? null;
  }

  toggleOpen(event: Event) {
    event.stopPropagation();
    if (this.disabled()) return;
    this.open.set(!this.open());
    if (this.open()) {
      this.onTouched();
    }
  }

  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  close() {
    this.open.set(false);
  }

  choose(option: SelectOption) {
    this.value.set(option.value);
    this.onChange(option.value);
    this.open.set(false);
  }
}
