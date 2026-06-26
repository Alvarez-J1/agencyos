import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SettingsData, TeamSize } from '../../models/settings.model';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

type PreferenceItem = {
  key: keyof SettingsData['notifications'];
  label: string;
};

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly settingsService = inject(SettingsService);

  settings: SettingsData | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  readonly teamSizeOptions: TeamSize[] = ['Solo freelancer', '2-5 people', '6-15 people'];
  readonly notificationPreferences: PreferenceItem[] = [
    { key: 'taskAssigned', label: 'Email me when a task is assigned' },
    { key: 'weeklySummary', label: 'Send a weekly project summary' },
    { key: 'deadlineReminders', label: 'Notify me before upcoming deadlines' }
  ];

  ngOnInit(): void {
    this.loadSettings();
  }

  get securitySettings(): Array<{ label: string; value: string }> {
    if (!this.settings) {
      return [];
    }

    return [
      { label: 'Two-factor authentication', value: this.settings.security.twoFactorAuthentication },
      { label: 'Last password update', value: this.formatDate(this.settings.security.lastPasswordUpdate) },
      { label: 'Active sessions', value: this.settings.security.activeSessions }
    ];
  }

  loadSettings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Settings could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  saveSettings(): void {
    if (!this.settings) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.settingsService.updateSettings(this.settings).subscribe({
      next: (settings) => {
        this.settings = settings;
        this.authService.updateCurrentUser({
          name: settings.profile.name,
          email: settings.profile.email
        });
        this.successMessage = 'Settings saved.';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Settings could not be saved.';
        this.isSaving = false;
      }
    });
  }

  private formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
