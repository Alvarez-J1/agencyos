import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent {
  notificationPreferences = [
    { label: 'Email me when a task is assigned', enabled: true },
    { label: 'Send a weekly project summary', enabled: true },
    { label: 'Notify me before upcoming deadlines', enabled: false }
  ];

  securitySettings = [
    { label: 'Two-factor authentication', value: 'Not enabled' },
    { label: 'Last password update', value: 'May 18, 2026' },
    { label: 'Active sessions', value: '2 devices' }
  ];
}
