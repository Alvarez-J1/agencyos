import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';

import { SettingsData } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/settings';

  getSettings(): Observable<SettingsData> {
    return this.http.get<SettingsData>(this.apiUrl).pipe(timeout(8000));
  }

  updateSettings(settings: SettingsData): Observable<SettingsData> {
    return this.http.put<SettingsData>(this.apiUrl, settings).pipe(timeout(8000));
  }
}
