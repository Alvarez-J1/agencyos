import { Component, inject } from '@angular/core';
import { LucideMenu } from '@lucide/angular';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { MobileNavService } from '../../services/mobile-nav.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, LucideMenu],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class TopbarComponent {
  private readonly authService = inject(AuthService);
  private readonly currentUser = this.authService.getCurrentUser();
  readonly nav = inject(MobileNavService);

  readonly displayName = this.currentUser?.name ?? 'Avery';
  readonly displayEmail = this.currentUser?.email ?? 'avery@agencyos.com';
  readonly userInitials = this.getInitials(this.displayName);

  private getInitials(name: string): string {
    const initials = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    return initials || 'AO';
  }
}
