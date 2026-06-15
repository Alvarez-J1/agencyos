import { Component } from '@angular/core';

type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Completed';

type Project = {
  id: number;
  name: string;
  client: string;
  status: ProjectStatus;
  dueDate: string;
  progress: number;
};

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent {
  searchTerm = '';
  selectedStatus: ProjectStatus | 'All' = 'All';

  statusOptions: Array<ProjectStatus | 'All'> = ['All', 'Planning', 'In Progress', 'Review', 'Completed'];

  projects: Project[] = [
    {
      id: 101,
      name: 'Website redesign',
      client: 'Northstar Studio',
      status: 'In Progress',
      dueDate: 'Jul 12, 2026',
      progress: 68
    },
    {
      id: 102,
      name: 'Launch campaign',
      client: 'BrightPath Coaching',
      status: 'Planning',
      dueDate: 'Jul 24, 2026',
      progress: 25
    },
    {
      id: 103,
      name: 'Monthly retainer',
      client: 'Harbor Legal Group',
      status: 'Review',
      dueDate: 'Jun 28, 2026',
      progress: 82
    },
    {
      id: 104,
      name: 'Client portal refresh',
      client: 'Summit Fitness Co.',
      status: 'Completed',
      dueDate: 'Jun 2, 2026',
      progress: 100
    }
  ];

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
