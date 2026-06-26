import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';

type NavItem = {
  label: string;
  route: string;
  exact: boolean;
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  navItems: NavItem[] = [
    { label: 'Home', route: '/dashboard', exact: true },
    { label: 'Clients', route: '/clients', exact: false },
    { label: 'Projects', route: '/projects', exact: true },
    { label: 'Tasks', route: '/tasks', exact: true },
    { label: 'Settings', route: '/settings', exact: true }
  ];

  signOut(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
