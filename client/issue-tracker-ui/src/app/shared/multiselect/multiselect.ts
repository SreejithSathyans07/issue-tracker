import { Component, HostListener, input, output, signal } from '@angular/core';
import { Icon } from '../icon/icon';

export interface MultiselectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-multiselect',
  imports: [Icon],
  templateUrl: './multiselect.html',
  styleUrl: './multiselect.css'
})
export class Multiselect {
  label = input.required<string>();
  options = input.required<MultiselectOption[]>();
  selected = input<number[]>([]);

  selectedChange = output<number[]>();

  open = signal(false);

  toggleOpen(event: Event) {
    event.stopPropagation();
    this.open.set(!this.open());
  }

  @HostListener('document:click')
  close() {
    this.open.set(false);
  }

  isChecked(id: number): boolean {
    return this.selected().includes(id);
  }

  toggleOption(id: number) {
    const current = this.selected();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    this.selectedChange.emit(next);
  }

  get allSelected(): boolean {
    return this.options().length > 0 && this.selected().length === this.options().length;
  }

  toggleAll() {
    this.selectedChange.emit(this.allSelected ? [] : this.options().map((o) => o.id));
  }
}
