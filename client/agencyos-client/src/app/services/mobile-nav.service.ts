import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

/**
 * Controls the mobile navigation drawer. Shared between the topbar (which opens
 * it via the hamburger button) and the sidebar (which renders the drawer), so
 * the two stay in sync without input/output plumbing.
 */
@Injectable({ providedIn: 'root' })
export class MobileNavService {
  private readonly document = inject(DOCUMENT);

  readonly isOpen = signal(false);

  constructor() {
    // Lock background scrolling while the drawer is open.
    effect(() => {
      const { body } = this.document;

      if (body) {
        body.style.overflow = this.isOpen() ? 'hidden' : '';
      }
    });
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }
}
