import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { LookupTab } from '../../shared/lookup-tab/lookup-tab';
import { ColoredLookupTab, ColorOption } from '../../shared/colored-lookup-tab/colored-lookup-tab';
import { Lookup, LookupItem, ColoredLookupItem, ColoredLookupRequest } from '../../core/lookup';
import { Auth, UserResponse } from '../../core/auth';

type Tab = 'users' | 'status' | 'impact' | 'variant' | 'build';

@Component({
  selector: 'app-admin',
  imports: [Icon, LookupTab, ColoredLookupTab],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private lookup = inject(Lookup);
  private auth = inject(Auth);
  private router = inject(Router);

  activeTab = signal<Tab>('users');

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
    this.reloadUsers();
    this.reloadStatuses();
    this.reloadImpacts();
    this.reloadVariants();
    this.reloadBuilds();
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
    this.lookup.getUsers().subscribe((u) => this.users.set(u));
  }

  toggleRole(user: UserResponse) {
    this.userError.set(null);
    const newRole = user.role === 'Admin' ? 'User' : 'Admin';
    this.lookup.updateUserRole(user.id, newRole).subscribe({
      next: () => this.reloadUsers(),
      error: (err) => this.userError.set(err.error ?? 'Failed to update role.')
    });
  }

  // Statuses
  reloadStatuses() {
    this.lookup.getStatuses().subscribe((s) => this.statuses.set(s));
  }
  createStatus(request: ColoredLookupRequest) {
    this.statusError.set(null);
    this.lookup.createStatus(request).subscribe({
      next: () => this.reloadStatuses(),
      error: (err) => this.statusError.set(err.error ?? 'Failed to add status.')
    });
  }
  updateStatus(event: { id: number; request: ColoredLookupRequest }) {
    this.statusError.set(null);
    this.lookup.updateStatus(event.id, event.request).subscribe({
      next: () => this.reloadStatuses(),
      error: (err) => this.statusError.set(err.error ?? 'Failed to update status.')
    });
  }
  deleteStatus(id: number) {
    this.statusError.set(null);
    this.lookup.deleteStatus(id).subscribe({
      next: () => this.reloadStatuses(),
      error: (err) => this.statusError.set(err.error ?? 'Failed to delete status.')
    });
  }

  // Impacts
  reloadImpacts() {
    this.lookup.getImpacts().subscribe((i) => this.impacts.set(i));
  }
  createImpact(request: ColoredLookupRequest) {
    this.impactError.set(null);
    this.lookup.createImpact(request).subscribe({
      next: () => this.reloadImpacts(),
      error: (err) => this.impactError.set(err.error ?? 'Failed to add impact.')
    });
  }
  updateImpact(event: { id: number; request: ColoredLookupRequest }) {
    this.impactError.set(null);
    this.lookup.updateImpact(event.id, event.request).subscribe({
      next: () => this.reloadImpacts(),
      error: (err) => this.impactError.set(err.error ?? 'Failed to update impact.')
    });
  }
  deleteImpact(id: number) {
    this.impactError.set(null);
    this.lookup.deleteImpact(id).subscribe({
      next: () => this.reloadImpacts(),
      error: (err) => this.impactError.set(err.error ?? 'Failed to delete impact.')
    });
  }

  // Variants
  reloadVariants() {
    this.lookup.getVariants().subscribe((v) => this.variants.set(v));
  }
  createVariant(name: string) {
    this.variantError.set(null);
    this.lookup.createVariant(name.toUpperCase()).subscribe({
      next: () => this.reloadVariants(),
      error: (err) => this.variantError.set(err.error ?? 'Failed to add variant.')
    });
  }
  updateVariant(event: { id: number; name: string }) {
    this.variantError.set(null);
    this.lookup.updateVariant(event.id, event.name.toUpperCase()).subscribe({
      next: () => this.reloadVariants(),
      error: (err) => this.variantError.set(err.error ?? 'Failed to update variant.')
    });
  }
  deleteVariant(id: number) {
    this.variantError.set(null);
    this.lookup.deleteVariant(id).subscribe({
      next: () => this.reloadVariants(),
      error: (err) => this.variantError.set(err.error ?? 'Failed to delete variant.')
    });
  }

  // Builds
  reloadBuilds() {
    this.lookup.getBuilds().subscribe((b) => this.builds.set(b));
  }
  createBuild(name: string) {
    this.buildError.set(null);
    this.lookup.createBuild(name).subscribe({
      next: () => this.reloadBuilds(),
      error: (err) => this.buildError.set(err.error ?? 'Failed to add build.')
    });
  }
  updateBuild(event: { id: number; name: string }) {
    this.buildError.set(null);
    this.lookup.updateBuild(event.id, event.name).subscribe({
      next: () => this.reloadBuilds(),
      error: (err) => this.buildError.set(err.error ?? 'Failed to update build.')
    });
  }
  deleteBuild(id: number) {
    this.buildError.set(null);
    this.lookup.deleteBuild(id).subscribe({
      next: () => this.reloadBuilds(),
      error: (err) => this.buildError.set(err.error ?? 'Failed to delete build.')
    });
  }
}
