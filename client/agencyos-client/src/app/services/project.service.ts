import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';

import { Project } from '../models/project.model';

export type CreateProjectRequest = Pick<Project, 'name' | 'client' | 'status' | 'dueDate' | 'notes'>;
export type UpdateProjectRequest = Partial<Omit<Project, '_id' | 'id'>>;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/projects';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(timeout(8000));
  }

  getProject(id: number | string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }

  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project).pipe(timeout(8000));
  }

  updateProject(id: number | string, updates: UpdateProjectRequest): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, updates).pipe(timeout(8000));
  }

  deleteProject(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }
}
