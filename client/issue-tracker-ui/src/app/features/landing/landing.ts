import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Icon } from '../../shared/icon/icon';
import { Loader } from '../../shared/loader/loader';
import { Multiselect, MultiselectOption } from '../../shared/multiselect/multiselect';
import { Select, SelectOption } from '../../shared/select/select';
import { Tooltip } from '../../shared/tooltip/tooltip';
import { ProfileMenu } from '../../shared/profile-menu/profile-menu';
import { Auth, UserResponse } from '../../core/auth';
import { Bug as BugService, BugResponse, BugFilter, UpdateBugRequest } from '../../core/bug';
import { Lookup, LookupItem, ColoredLookupItem } from '../../core/lookup';
import { Toast } from '../../core/toast';
import { BugModal } from '../bug-modal/bug-modal';

@Component({
  selector: 'app-landing',
  imports: [FormsModule, Icon, Loader, Multiselect, Select, Tooltip, ProfileMenu, BugModal],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {
  protected auth = inject(Auth);
  private bugService = inject(BugService);
  private lookup = inject(Lookup);
  private toast = inject(Toast);

  bugs = signal<BugResponse[]>([]);
  loading = signal(false);
  loadError = signal<string | null>(null);

  variants = signal<LookupItem[]>([]);
  impacts = signal<ColoredLookupItem[]>([]);
  statuses = signal<ColoredLookupItem[]>([]);
  builds = signal<LookupItem[]>([]);
  users = signal<UserResponse[]>([]);

  modalOpen = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  editingBug = signal<BugResponse | null>(null);

  selectedVariantId = signal<number | null>(null);
  selectedImpactIds = signal<number[]>([]);
  selectedStatusIds = signal<number[]>([]);
  selectedReporterIds = signal<number[]>([]);
  selectedResponsibleIds = signal<number[]>([]);
  selectedBuildIds = signal<number[]>([]);
  searchText = signal('');
  private searchTextChanged = new Subject<string>();
  private debouncedSearch$ = this.searchTextChanged.pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed());

  ngOnInit() {
    this.debouncedSearch$.subscribe(() => this.loadBugs());

    this.loadBugs();
    this.lookup.getVariants().subscribe((v) => this.variants.set(v));
    this.lookup.getImpacts().subscribe((i) => this.impacts.set(i));
    this.lookup.getStatuses().subscribe((s) => this.statuses.set(s));
    this.lookup.getBuilds().subscribe((b) => this.builds.set(b));
    this.lookup.getUsers().subscribe((u) => this.users.set(u));
  }

  private buildFilter(): BugFilter {
    const variantId = this.selectedVariantId();
    return {
      variantIds: variantId ? [variantId] : undefined,
      impactIds: this.selectedImpactIds().length ? this.selectedImpactIds() : undefined,
      statusIds: this.selectedStatusIds().length ? this.selectedStatusIds() : undefined,
      reporterIds: this.selectedReporterIds().length ? this.selectedReporterIds() : undefined,
      responsibleIds: this.selectedResponsibleIds().length ? this.selectedResponsibleIds() : undefined,
      affectedBuildIds: this.selectedBuildIds().length ? this.selectedBuildIds() : undefined,
      search: this.searchText().trim() || undefined
    };
  }

  loadBugs() {
    this.loading.set(true);
    this.loadError.set(null);
    this.bugService.getAll(this.buildFilter()).subscribe({
      next: (bugs) => {
        this.bugs.set(bugs);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Failed to load bugs.');
        this.loading.set(false);
      }
    });
  }

  get variantSelectOptions(): SelectOption[] {
    return [{ value: 'ALL', label: 'All Variants' }, ...this.variants().map((v) => ({ value: v.id, label: v.name }))];
  }

  get statusSelectOptions(): SelectOption[] {
    return this.statuses().map((s) => ({ value: s.name, label: s.name, icon: s.icon, color: s.color }));
  }

  onVariantChange(value: number | string | null) {
    this.selectedVariantId.set(value === 'ALL' || value === null ? null : Number(value));
    this.loadBugs();
  }

  onSearchTextChange(value: string) {
    this.searchText.set(value);
    this.searchTextChanged.next(value);
  }

  applySearch() {
    this.loadBugs();
  }

  clearFilters() {
    this.selectedVariantId.set(null);
    this.selectedImpactIds.set([]);
    this.selectedStatusIds.set([]);
    this.selectedReporterIds.set([]);
    this.selectedResponsibleIds.set([]);
    this.selectedBuildIds.set([]);
    this.searchText.set('');
    this.loadBugs();
  }

  toOptions(items: { id: number; name: string }[]): MultiselectOption[] {
    return items.map((i) => ({ id: i.id, label: i.name }));
  }

  toUserOptions(items: UserResponse[]): MultiselectOption[] {
    return items.map((u) => ({ id: u.id, label: u.name }));
  }

  statusDistribution(): { name: string; color: string; count: number; dashArray: string; dashOffset: number }[] {
    const total = this.bugs().length;
    if (total === 0) return [];

    const segments = this.statuses()
      .map((s) => ({
        name: s.name,
        color: s.color,
        count: this.bugs().filter((b) => b.status === s.name).length
      }))
      .filter((s) => s.count > 0);

    let cumulativePercent = 0;
    return segments.map((s) => {
      const percent = (s.count / total) * 100;
      const dashOffset = 25 - cumulativePercent;
      cumulativePercent += percent;
      return { ...s, dashArray: `${percent} ${100 - percent}`, dashOffset };
    });
  }

  donutCenterFontSize(): string {
    const digits = this.bugs().length.toString().length;
    if (digits <= 2) return '0.8125rem';
    if (digits === 3) return '0.6875rem';
    return '0.5625rem';
  }

  impactMeta(name: string): ColoredLookupItem | null {
    return this.impacts().find((i) => i.name === name) ?? null;
  }

  statusMeta(name: string): ColoredLookupItem | null {
    return this.statuses().find((s) => s.name === name) ?? null;
  }

  sevClass(impact: string): string {
    if (impact === 'Blocker') return 'sev-blocker';
    if (impact === 'Critical') return 'sev-high';
    return '';
  }

  openAddModal() {
    this.modalMode.set('add');
    this.editingBug.set(null);
    this.modalOpen.set(true);
  }

  openEditModal(bug: BugResponse) {
    this.modalMode.set('edit');
    this.editingBug.set(bug);
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  onBugSaved() {
    this.modalOpen.set(false);
    this.toast.success(this.modalMode() === 'add' ? 'Bug created successfully.' : 'Bug updated successfully.');
    this.loadBugs();
  }

  quickChangeStatus(bug: BugResponse, statusName: string) {
    const statusId = this.statuses().find((s) => s.name === statusName)?.id;
    const variantId = this.variants().find((v) => v.name === bug.variant)?.id;
    const impactId = this.impacts().find((i) => i.name === bug.impact)?.id;
    const affectedBuildId = this.builds().find((b) => b.name === bug.affectedBuild)?.id;
    const fixedBuildId = this.builds().find((b) => b.name === bug.fixedBuild)?.id ?? null;
    const responsibleId = this.users().find((u) => u.name === bug.responsible)?.id;

    if (!statusId || !variantId || !impactId || !affectedBuildId || !responsibleId) {
      return;
    }

    const payload: UpdateBugRequest = {
      title: bug.title,
      description: bug.description,
      affectedBuildId,
      expectedBehavior: bug.expectedBehavior,
      remarks: bug.remarks,
      variantId,
      impactId,
      statusId,
      fixedBuildId,
      responsibleId
    };

    this.bugService.update(bug.bugId, payload).subscribe({
      next: () => {
        this.toast.success(`Status changed to "${statusName}".`);
        this.loadBugs();
      },
      error: () => this.toast.error('Failed to change status. Please try again.')
    });
  }
}
