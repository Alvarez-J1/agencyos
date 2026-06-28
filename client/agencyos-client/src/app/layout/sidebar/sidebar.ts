import { Component, HostListener, inject } from '@angular/core';
import {
  LucideCheckSquare,
  LucideFolderKanban,
  LucideHouse,
  LucideLogOut,
  LucideSettings,
  LucideUsers,
  LucideX
} from '@lucide/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { MobileNavService } from '../../services/mobile-nav.service';

type NavIcon = 'home' | 'clients' | 'projects' | 'tasks' | 'settings';

type NavItem = {
  label: string;
  route: string;
  exact: boolean;
  icon: NavIcon;
};

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideCheckSquare,
    LucideFolderKanban,
    LucideHouse,
    LucideLogOut,
    LucideSettings,
    LucideUsers,
    LucideX
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly nav = inject(MobileNavService);

  navItems: NavItem[] = [
    { label: 'Home', route: '/dashboard', exact: true, icon: 'home' },
    { label: 'Clients', route: '/clients', exact: false, icon: 'clients' },
    { label: 'Projects', route: '/projects', exact: true, icon: 'projects' },
    { label: 'Tasks', route: '/tasks', exact: true, icon: 'tasks' },
    { label: 'Settings', route: '/settings', exact: true, icon: 'settings' }
  ];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.nav.close();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      this.nav.close();
    }
  }

  signOut(): void {
    this.nav.close();
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
