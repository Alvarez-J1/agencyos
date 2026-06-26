import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Project, ProjectStatus } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly projectId = this.route.snapshot.paramMap.get('id') ?? '';

  project: Project | undefined;
  editProject: Project | undefined;
  isLoading = true;
  isEditing = false;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  actionMessage = '';

  readonly statusOptions: ProjectStatus[] = ['Planning', 'In Progress', 'Review', 'Completed'];

  ngOnInit(): void {
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.editProject = { ...project };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Project could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  startEditing(): void {
    if (!this.project) {
      return;
    }

    this.editProject = { ...this.project };
    this.isEditing = true;
    this.errorMessage = '';
    this.actionMessage = '';
  }

  cancelEditing(): void {
    this.editProject = this.project ? { ...this.project } : undefined;
    this.isEditing = false;
    this.errorMessage = '';
  }

  saveProject(): void {
    if (!this.editProject) {
      return;
    }

    if (!this.editProject.name.trim() || !this.editProject.client.trim() || !this.editProject.dueDate.trim()) {
      this.errorMessage = 'Project name, client, and due date are required.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.actionMessage = '';

    this.projectService
      .updateProject(this.projectId, {
        name: this.editProject.name,
        client: this.editProject.client,
        status: this.editProject.status,
        dueDate: this.editProject.dueDate,
        progress: Number(this.editProject.progress),
        notes: this.editProject.notes
      })
      .subscribe({
        next: (project) => {
          this.project = project;
          this.editProject = { ...project };
          this.isEditing = false;
          this.isSaving = false;
          this.actionMessage = 'Project updated.';
        },
        error: () => {
          this.errorMessage = 'Project could not be updated.';
          this.isSaving = false;
        }
      });
  }

  deleteProject(): void {
    if (!this.project || !confirm(`Delete ${this.project.name}? This cannot be undone.`)) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.projectService.deleteProject(this.projectId).subscribe({
      next: () => {
        this.router.navigateByUrl('/projects');
      },
      error: () => {
        this.errorMessage = 'Project could not be deleted.';
        this.isDeleting = false;
      }
    });
  }
}
