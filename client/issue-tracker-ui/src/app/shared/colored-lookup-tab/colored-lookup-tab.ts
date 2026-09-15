import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon, PICKABLE_ICON_NAMES } from '../icon/icon';
import { ColoredLookupItem, ColoredLookupRequest } from '../../core/lookup';
import { Confirm } from '../../core/confirm';

export interface ColorOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-colored-lookup-tab',
  imports: [FormsModule, Icon],
  templateUrl: './colored-lookup-tab.html',
  styleUrl: './colored-lookup-tab.css'
})
export class ColoredLookupTab {
  private confirm = inject(Confirm);

  heading = input.required<string>();
  description = input.required<string>();
  placeholder = input('e.g. New value');
  itemLabel = input('entry');
  items = input.required<ColoredLookupItem[]>();
  colorOptions = input.required<ColorOption[]>();
  error = input<string | null>(null);

  create = output<ColoredLookupRequest>();
  update = output<{ id: number; request: ColoredLookupRequest }>();
  delete = output<number>();

  protected iconOptions = PICKABLE_ICON_NAMES;

  newName = signal('');
  newColor = signal('');
  newIcon = signal('tag');

  editingId = signal<number | null>(null);
  editName = signal('');
  editColor = signal('');
  editIcon = signal('tag');

  private defaultColor() {
    return this.colorOptions()[0]?.value ?? '#6B7280';
  }

  submitNew() {
    const name = this.newName().trim();
    if (!name) return;

    this.create.emit({
      name,
      color: this.newColor() || this.defaultColor(),
      icon: this.newIcon()
    });
    this.newName.set('');
    this.newColor.set('');
    this.newIcon.set('tag');
  }

  startEdit(item: ColoredLookupItem) {
    this.editingId.set(item.id);
    this.editName.set(item.name);
    this.editColor.set(item.color);
    this.editIcon.set(item.icon);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  submitEdit(id: number) {
    const name = this.editName().trim();
    if (!name) return;

    this.update.emit({
      id,
      request: { name, color: this.editColor(), icon: this.editIcon() }
    });
    this.cancelEdit();
  }

  async requestDelete(item: ColoredLookupItem) {
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
