import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { Loader } from '../../shared/loader/loader';
import { Auth, UserResponse } from '../../core/auth';
import { Bug as BugService, BugResponse, UpdateBugRequest } from '../../core/bug';
import { Lookup, LookupItem, ColoredLookupItem } from '../../core/lookup';
import { BugModal } from '../bug-modal/bug-modal';

@Component({
  selector: 'app-landing',
  imports: [Icon, Loader, BugModal],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {
  protected auth = inject(Auth);
  private router = inject(Router);
  private bugService = inject(BugService);
  private lookup = inject(Lookup);

  bugs = signal<BugResponse[]>([]);
  loading = signal(false);
  loadError = signal<string | null>(null);

  variants = signal<LookupItem[]>([]);
  impacts = signal<ColoredLookupItem[]>([]);
  statuses = signal<ColoredLookupItem[]>([]);
  builds = signal<LookupItem[]>([]);
  users = signal<UserResponse[]>([]);

  profileMenuOpen = signal(false);
  modalOpen = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  editingBug = signal<BugResponse | null>(null);

  ngOnInit() {
    this.loadBugs();
    this.lookup.getVariants().subscribe((v) => this.variants.set(v));
    this.lookup.getImpacts().subscribe((i) => this.impacts.set(i));
    this.lookup.getStatuses().subscribe((s) => this.statuses.set(s));
    this.lookup.getBuilds().subscribe((b) => this.builds.set(b));
    this.lookup.getUsers().subscribe((u) => this.users.set(u));
  }

  loadBugs() {
    this.loading.set(true);
    this.loadError.set(null);
    this.bugService.getAll().subscribe({
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

  initials(name: string | undefined): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
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

  toggleProfileMenu() {
    this.profileMenuOpen.set(!this.profileMenuOpen());
  }

  @HostListener('document:click')
  closeProfileMenu() {
    this.profileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
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
      next: () => this.loadBugs()
    });
  }
}
