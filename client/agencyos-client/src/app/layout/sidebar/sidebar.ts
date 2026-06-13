import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', exact: true },
    { label: 'Clients', route: '/clients', exact: false },
    { label: 'Projects', route: '/projects', exact: true },
    { label: 'Tasks', route: '/tasks', exact: true },
    { label: 'Settings', route: '/settings', exact: true }
  ];
}
