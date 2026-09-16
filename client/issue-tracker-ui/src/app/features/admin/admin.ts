import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Icon } from '../../shared/icon/icon';
import { Loader } from '../../shared/loader/loader';
import { LookupTab } from '../../shared/lookup-tab/lookup-tab';
import { ColoredLookupTab, ColorOption } from '../../shared/colored-lookup-tab/colored-lookup-tab';
import { Lookup, LookupItem, ColoredLookupItem, ColoredLookupRequest } from '../../core/lookup';
import { Auth, UserResponse } from '../../core/auth';
import { Toast } from '../../core/toast';
import { Confirm } from '../../core/confirm';

type Tab = 'users' | 'status' | 'impact' | 'variant' | 'build';

@Component({
  selector: 'app-admin',
  imports: [Icon, Loader, LookupTab, ColoredLookupTab],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private lookup = inject(Lookup);
  protected auth = inject(Auth);
  private router = inject(Router);
  private toast = inject(Toast);
  private confirm = inject(Confirm);

  activeTab = signal<Tab>('users');
  loading = signal(false);

  users = signal<UserResponse[]>([]);
  statuses = signal<ColoredLookupItem[]>([]);
  impacts = signal<ColoredLookupItem[]>([]);
  variants = signal<LookupItem[]>([]);
  builds = signal<LookupItem[]>([]);

  userError = signal<string | null>(null);
  statusError = signal<string | null>(null);
  impactError = signal<string | null>(null);
  variantError = signal<string | null>(null);
  buildError = signal<string | null>(null);

  statusColors: ColorOption[] = [
    { value: '#2563EB', label: 'Blue' },
    { value: '#D97706', label: 'Amber' },
    { value: '#7C3AED', label: 'Violet' },
    { value: '#059669', label: 'Green' },
    { value: '#6B7280', label: 'Grey' },
    { value: '#DC2626', label: 'Red' }
  ];

  impactColors: ColorOption[] = [
    { value: '#9CA3AF', label: 'Grey' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#EF4444', label: 'Red' },
    { value: '#7F1D1D', label: 'Dark Red' }
  ];

  ngOnInit() {
    this.loading.set(true);
    forkJoin({
      users: this.auth.isAdmin() ? this.lookup.getUsers() : of([]),
      statuses: this.lookup.getStatuses(),
      impacts: this.lookup.getImpacts(),
      variants: this.lookup.getVariants(),
      builds: this.lookup.getBuilds()
    }).subscribe({
      next: (result) => {
        this.users.set(result.users);
        this.statuses.set(result.statuses);
        this.impacts.set(result.impacts);
        this.variants.set(result.variants);
        this.builds.set(result.builds);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load admin data.');
      }
    });
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  back() {
    this.router.navigate(['/bugs']);
  }

  currentUserId(): number | null {
    return this.auth.getUser()?.id ?? null;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  // Users
  reloadUsers() {
    this.lookup.getUsers().subscribe((u) => {
      this.users.set(u);
      this.loading.set(false);
    });
  }

  toggleRole(user: UserResponse) {
    this.userError.set(null);
    const newRole = user.role === 'Admin' ? 'User' : 'Admin';
    this.loading.set(true);
    this.lookup.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        this.toast.success(`${user.name} is now ${newRole === 'Admin' ? 'an Admin' : 'a Member'}.`);
        this.reloadUsers();
      },
      error: (err) => {
        this.userError.set(err.error ?? 'Failed to update role.');
        this.loading.set(false);
      }
    });
  }

  // Statuses
  reloadStatuses() {
    this.lookup.getStatuses().subscribe((s) => {
      this.statuses.set(s);
      this.loading.set(false);
    });
  }
  createStatus(request: ColoredLookupRequest) {
    this.statusError.set(null);
    this.loading.set(true);
    this.lookup.createStatus(request).subscribe({
      next: () => {
        this.toast.success(`Status "${request.name}" added.`);
        this.reloadStatuses();
      },
      error: (err) => {
        this.statusError.set(err.error ?? 'Failed to add status.');
        this.loading.set(false);
      }
    });
  }
  updateStatus(event: { id: number; request: ColoredLookupRequest }) {
    this.statusError.set(null);
    this.loading.set(true);
    this.lookup.updateStatus(event.id, event.request).subscribe({
      next: () => {
        this.toast.success(`Status "${event.request.name}" updated.`);
        this.reloadStatuses();
      },
      error: (err) => {
        this.statusError.set(err.error ?? 'Failed to update status.');
        this.loading.set(false);
      }
    });
  }
  deleteStatus(id: number) {
    this.statusError.set(null);
    this.loading.set(true);
    this.lookup.deleteStatus(id).subscribe({
      next: () => {
        this.toast.success('Status deleted.');
        this.reloadStatuses();
      },
      error: (err) => {
        this.loading.set(false);
        this.confirm.alert({ title: 'Cannot delete status', message: err.error ?? 'Failed to delete status.' });
      }
    });
  }

  // Impacts
  reloadImpacts() {
    this.lookup.getImpacts().subscribe((i) => {
      this.impacts.set(i);
      this.loading.set(false);
    });
  }
  createImpact(request: ColoredLookupRequest) {
    this.impactError.set(null);
    this.loading.set(true);
    this.lookup.createImpact(request).subscribe({
      next: () => {
        this.toast.success(`Impact "${request.name}" added.`);
        this.reloadImpacts();
      },
      error: (err) => {
        this.impactError.set(err.error ?? 'Failed to add impact.');
        this.loading.set(false);
      }
    });
  }
  updateImpact(event: { id: number; request: ColoredLookupRequest }) {
    this.impactError.set(null);
    this.loading.set(true);
    this.lookup.updateImpact(event.id, event.request).subscribe({
      next: () => {
        this.toast.success(`Impact "${event.request.name}" updated.`);
        this.reloadImpacts();
      },
      error: (err) => {
        this.impactError.set(err.error ?? 'Failed to update impact.');
        this.loading.set(false);
      }
    });
  }
  deleteImpact(id: number) {
    this.impactError.set(null);
    this.loading.set(true);
    this.lookup.deleteImpact(id).subscribe({
      next: () => {
        this.toast.success('Impact deleted.');
        this.reloadImpacts();
      },
      error: (err) => {
        this.loading.set(false);
        this.confirm.alert({ title: 'Cannot delete impact', message: err.error ?? 'Failed to delete impact.' });
      }
    });
  }

  // Variants
  reloadVariants() {
    this.lookup.getVariants().subscribe((v) => {
      this.variants.set(v);
      this.loading.set(false);
    });
  }
  createVariant(name: string) {
    this.variantError.set(null);
    this.loading.set(true);
    this.lookup.createVariant(name.toUpperCase()).subscribe({
      next: () => {
        this.toast.success(`Variant "${name.toUpperCase()}" added.`);
        this.reloadVariants();
      },
      error: (err) => {
        this.variantError.set(err.error ?? 'Failed to add variant.');
        this.loading.set(false);
      }
    });
  }
  updateVariant(event: { id: number; name: string }) {
    this.variantError.set(null);
    this.loading.set(true);
    this.lookup.updateVariant(event.id, event.name.toUpperCase()).subscribe({
      next: () => {
        this.toast.success(`Variant "${event.name.toUpperCase()}" updated.`);
        this.reloadVariants();
      },
      error: (err) => {
        this.variantError.set(err.error ?? 'Failed to update variant.');
        this.loading.set(false);
      }
    });
  }
  deleteVariant(id: number) {
    this.variantError.set(null);
    this.loading.set(true);
    this.lookup.deleteVariant(id).subscribe({
      next: () => {
        this.toast.success('Variant deleted.');
        this.reloadVariants();
      },
      error: (err) => {
        this.loading.set(false);
        this.confirm.alert({ title: 'Cannot delete variant', message: err.error ?? 'Failed to delete variant.' });
      }
    });
  }

  // Builds
  reloadBuilds() {
    this.lookup.getBuilds().subscribe((b) => {
      this.builds.set(b);
      this.loading.set(false);
    });
  }
  createBuild(name: string) {
    this.buildError.set(null);
    this.loading.set(true);
    this.lookup.createBuild(name).subscribe({
      next: () => {
        this.toast.success(`Build "${name}" added.`);
        this.reloadBuilds();
      },
      error: (err) => {
        this.buildError.set(err.error ?? 'Failed to add build.');
        this.loading.set(false);
      }
    });
  }
  updateBuild(event: { id: number; name: string }) {
    this.buildError.set(null);
    this.loading.set(true);
    this.lookup.updateBuild(event.id, event.name).subscribe({
      next: () => {
        this.toast.success(`Build "${event.name}" updated.`);
        this.reloadBuilds();
      },
      error: (err) => {
        this.buildError.set(err.error ?? 'Failed to update build.');
        this.loading.set(false);
      }
    });
  }
  deleteBuild(id: number) {
    this.buildError.set(null);
    this.loading.set(true);
    this.lookup.deleteBuild(id).subscribe({
      next: () => {
        this.toast.success('Build deleted.');
        this.reloadBuilds();
      },
      error: (err) => {
        this.loading.set(false);
        this.confirm.alert({ title: 'Cannot delete build', message: err.error ?? 'Failed to delete build.' });
      }
    });
  }
}
