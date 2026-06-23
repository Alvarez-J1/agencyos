import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class TopbarComponent {
  private readonly authService = inject(AuthService);
  private readonly currentUser = this.authService.getCurrentUser();

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
