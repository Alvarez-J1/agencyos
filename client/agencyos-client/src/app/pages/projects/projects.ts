import { Component, inject, OnInit } from '@angular/core';

import { Project, ProjectStatus } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  searchTerm = '';
  selectedStatus: ProjectStatus | 'All' = 'All';
  isLoading = true;
  errorMessage = '';

  statusOptions: Array<ProjectStatus | 'All'> = ['All', 'Planning', 'In Progress', 'Review', 'Completed'];

  projects: Project[] = [];

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Projects could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  get filteredProjects(): Project[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.projects.filter((project) => {
      const matchesSearch =
        !search ||
        [project.name, project.client, project.status, project.dueDate, project.progress.toString()].some((value) =>
          value.toLowerCase().includes(search)
        );

      const matchesStatus = this.selectedStatus === 'All' || project.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value as ProjectStatus | 'All';
  }
}
