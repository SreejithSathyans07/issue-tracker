import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../icon/icon';
import { LookupItem } from '../../core/lookup';
import { Confirm } from '../../core/confirm';

@Component({
  selector: 'app-lookup-tab',
  imports: [FormsModule, Icon],
  templateUrl: './lookup-tab.html',
  styleUrl: './lookup-tab.css'
})
export class LookupTab {
  private confirm = inject(Confirm);

  heading = input.required<string>();
  description = input.required<string>();
  placeholder = input('e.g. New value');
  itemLabel = input('entry');
  items = input.required<LookupItem[]>();
  error = input<string | null>(null);

  create = output<string>();
  update = output<{ id: number; name: string }>();
  delete = output<number>();

  newName = signal('');
  editingId = signal<number | null>(null);
  editingName = signal('');

  submitNew() {
    const name = this.newName().trim();
    if (!name) return;
    this.create.emit(name);
    this.newName.set('');
  }

  startEdit(item: LookupItem) {
    this.editingId.set(item.id);
    this.editingName.set(item.name);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editingName.set('');
  }

  submitEdit(id: number) {
    const name = this.editingName().trim();
    if (!name) return;
    this.update.emit({ id, name });
    this.cancelEdit();
  }

  async requestDelete(item: LookupItem) {
    const confirmed = await this.confirm.ask({
      variant: 'danger',
      title: `Delete "${item.name}"?`,
      message: `This ${this.itemLabel()} will be permanently removed. This action can't be undone.`,
      okLabel: 'Delete'
    });

    if (confirmed) {
      this.delete.emit(item.id);
    }
  }
}
