import { Component, HostListener, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Icon } from '../../shared/icon/icon';
import { Loader } from '../../shared/loader/loader';
import { STATUS_META, IMPACT_META, BugMeta } from '../../shared/bug-meta';
import { Bug as BugService, BugResponse, CreateBugRequest, UpdateBugRequest } from '../../core/bug';
import { LookupItem } from '../../core/lookup';
import { UserResponse } from '../../core/auth';

@Component({
  selector: 'app-bug-modal',
  imports: [ReactiveFormsModule, Icon, Loader],
  templateUrl: './bug-modal.html',
  styleUrl: './bug-modal.css'
})
export class BugModal {
  private fb = inject(FormBuilder);
  private bugService = inject(BugService);

  mode = input<'add' | 'edit'>('add');
  bug = input<BugResponse | null>(null);
  variants = input<LookupItem[]>([]);
  impacts = input<LookupItem[]>([]);
  statuses = input<LookupItem[]>([]);
  builds = input<LookupItem[]>([]);
  users = input<UserResponse[]>([]);
  reporterName = input<string>('');

  closed = output<void>();
  saved = output<BugResponse>();

  error = signal<string | null>(null);
  submitting = signal(false);
  private addDefaultsApplied = false;

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    expectedBehavior: [''],
    remarks: [''],
    affectedBuildId: [null as number | null, Validators.required],
    variantId: [null as number | null, Validators.required],
    impactId: [null as number | null, Validators.required],
    statusId: [null as number | null],
    fixedBuildId: [null as number | null],
    responsibleId: [null as number | null, Validators.required]
  });

  constructor() {
    if (this.mode() === 'edit') {
      this.form.get('statusId')?.addValidators(Validators.required);
    }

    effect(() => {
      const bug = this.bug();
      const statuses = this.statuses();
      const impacts = this.impacts();
      const variants = this.variants();
      const builds = this.builds();
      const users = this.users();

      if (this.mode() === 'edit' && bug) {
        this.form.patchValue(
          {
            title: bug.title,
            description: bug.description,
            expectedBehavior: bug.expectedBehavior ?? '',
            remarks: bug.remarks ?? '',
            affectedBuildId: builds.find((b) => b.name === bug.affectedBuild)?.id ?? null,
            variantId: variants.find((v) => v.name === bug.variant)?.id ?? null,
            impactId: impacts.find((i) => i.name === bug.impact)?.id ?? null,
            statusId: statuses.find((s) => s.name === bug.status)?.id ?? null,
            fixedBuildId: builds.find((b) => b.name === bug.fixedBuild)?.id ?? null,
            responsibleId: users.find((u) => u.name === bug.responsible)?.id ?? null
          },
          { emitEvent: false }
        );
      } else if (this.mode() === 'add' && statuses.length && !this.addDefaultsApplied) {
        const openId = statuses.find((s) => s.name === 'Open')?.id ?? null;
        this.form.patchValue({ statusId: openId }, { emitEvent: false });
        this.addDefaultsApplied = true;
      }
    });
  }

  get isEdit() {
    return this.mode() === 'edit';
  }

  metaFor(map: Record<string, BugMeta>, list: LookupItem[], id: number | null): BugMeta | null {
    const item = list.find((x) => x.id === id);
    return item ? (map[item.name] ?? null) : null;
  }

  get impactPreview(): BugMeta | null {
    return this.metaFor(IMPACT_META, this.impacts(), this.form.value.impactId ?? null);
  }

  get statusPreview(): BugMeta | null {
    return this.metaFor(STATUS_META, this.statuses(), this.form.value.statusId ?? null);
  }

  @HostListener('document:keydown.escape')
  close() {
    this.closed.emit();
  }

  submit() {
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please fill in all required fields.');
      return;
    }

    const v = this.form.getRawValue();
    this.submitting.set(true);

    if (this.mode() === 'add') {
      const payload: CreateBugRequest = {
        title: v.title!,
        description: v.description!,
        affectedBuildId: v.affectedBuildId!,
        expectedBehavior: v.expectedBehavior || null,
        remarks: v.remarks || null,
        variantId: v.variantId!,
        impactId: v.impactId!,
        responsibleId: v.responsibleId!
      };

      this.bugService.create(payload).subscribe({
        next: (created) => this.saved.emit(created),
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err.error ?? 'Failed to create bug.');
        }
      });
    } else {
      const payload: UpdateBugRequest = {
        title: v.title!,
        description: v.description!,
        affectedBuildId: v.affectedBuildId!,
        expectedBehavior: v.expectedBehavior || null,
        remarks: v.remarks || null,
        variantId: v.variantId!,
        impactId: v.impactId!,
        statusId: v.statusId!,
        fixedBuildId: v.fixedBuildId ?? null,
        responsibleId: v.responsibleId!
      };

      this.bugService.update(this.bug()!.bugId, payload).subscribe({
        next: (updated) => this.saved.emit(updated),
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err.error ?? 'Failed to update bug.');
        }
      });
    }
  }
}
