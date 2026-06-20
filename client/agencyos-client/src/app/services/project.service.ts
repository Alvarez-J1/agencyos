import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';

import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/projects';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(timeout(8000));
  }
}
