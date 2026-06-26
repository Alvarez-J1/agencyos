export type TeamSize = 'Solo freelancer' | '2-5 people' | '6-15 people';

export type SettingsProfile = {
  name: string;
  email: string;
  role: string;
};

export type SettingsCompany = {
  companyName: string;
  website: string;
  teamSize: TeamSize;
};

export type SettingsNotifications = {
  taskAssigned: boolean;
  weeklySummary: boolean;
  deadlineReminders: boolean;
};

export type SettingsSecurity = {
  twoFactorAuthentication: string;
  lastPasswordUpdate: string;
  activeSessions: string;
};

export type SettingsData = {
  profile: SettingsProfile;
  company: SettingsCompany;
  notifications: SettingsNotifications;
  security: SettingsSecurity;
};
