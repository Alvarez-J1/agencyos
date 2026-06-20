import { Component, inject, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';

import { Client } from '../../models/client.model';
import { Project, ProjectStatus } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { ClientService } from '../../services/client.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);

  clients: Client[] = [];
  projects: Project[] = [];
  tasks: Task[] = [];
  isLoading = true;
  errorMessage = '';

  recentActivity = [
    'Northstar Studio approved homepage mockups.',
    'BrightPath Coaching completed onboarding.',
    'Harbor Legal Group monthly report was prepared.'
  ];

  ngOnInit(): void {
    forkJoin({
      clients: this.clientService.getClients().pipe(catchError(() => of([] as Client[]))),
      projects: this.projectService.getProjects().pipe(catchError(() => of([] as Project[]))),
      tasks: this.taskService.getTasks().pipe(catchError(() => of([] as Task[])))
    }).subscribe({
      next: ({ clients, projects, tasks }) => {
        this.clients = clients;
        this.projects = projects;
        this.tasks = tasks;
        this.errorMessage =
          clients.length === 0 && projects.length === 0 && tasks.length === 0
            ? 'Dashboard data could not be loaded. Check that you are logged in and the backend is running.'
            : '';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Dashboard data could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  get totalClients(): number {
    return this.clients.length;
  }

  get activeProjects(): number {
    return this.projects.filter((project) => project.status !== 'Completed').length;
  }

  get completedProjects(): number {
    return this.projects.filter((project) => project.status === 'Completed').length;
  }

  get pendingTasks(): number {
    return this.tasks.filter((task) => task.status !== 'Completed').length;
  }

  get completedTasks(): number {
    return this.tasks.filter((task) => task.status === 'Completed').length;
  }

  get upcomingDeadlines(): Array<{ title: string; label: string; dueDate: string }> {
    return [
      ...this.projects
        .filter((project) => project.status !== 'Completed')
        .map((project) => ({ title: project.name, label: 'Project', dueDate: project.dueDate })),
      ...this.tasks
        .filter((task) => task.status !== 'Completed')
        .map((task) => ({ title: task.title, label: 'Task', dueDate: task.dueDate }))
    ].slice(0, 5);
  }

  get projectStatusOverview(): Array<{ status: ProjectStatus; count: number }> {
    const statuses: ProjectStatus[] = ['Planning', 'In Progress', 'Review', 'Completed'];

    return statuses.map((status) => ({
      status,
      count: this.projects.filter((project) => project.status === status).length
    }));
  }
}
