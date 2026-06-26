import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { Client } from '../../models/client.model';
import { Project, ProjectStatus } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

type ActivityTone = 'blue' | 'green' | 'amber';
type ActivityIcon = 'approval' | 'client' | 'report';
type DeadlineUrgency = 'due-soon' | 'upcoming' | 'scheduled';
type MetricBadgeTone = 'positive' | 'neutral' | 'warning';

interface ActivityItem {
  title: string;
  description: string;
  timestamp: string;
  tone: ActivityTone;
  icon: ActivityIcon;
}

interface DashboardDeadline {
  title: string;
  label: string;
  dueDate: string;
  urgency: DeadlineUrgency;
  urgencyLabel: string;
}

interface MetricBadge {
  text: string;
  tone: MetricBadgeTone;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly clientService = inject(ClientService);
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);
  private readonly currentUser = this.authService.getCurrentUser();

  clients: Client[] = [];
  projects: Project[] = [];
  tasks: Task[] = [];
  isLoading = true;
  errorMessage = '';
  private hasApiError = false;

  readonly welcomeName = this.currentUser?.name.trim().split(/\s+/)[0] ?? 'there';

  ngOnInit(): void {
    forkJoin({
      clients: this.clientService.getClients().pipe(catchError(() => this.handleLoadError([] as Client[]))),
      projects: this.projectService.getProjects().pipe(catchError(() => this.handleLoadError([] as Project[]))),
      tasks: this.taskService.getTasks().pipe(catchError(() => this.handleLoadError([] as Task[])))
    }).subscribe({
      next: ({ clients, projects, tasks }) => {
        this.clients = clients;
        this.projects = projects;
        this.tasks = tasks;
        this.errorMessage = this.hasApiError
          ? 'Home data could not be loaded. Check that you are logged in and the backend is running.'
          : '';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Home data could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  get hasNoClients(): boolean {
    return !this.errorMessage && this.clients.length === 0;
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

  get taskCompletionRate(): number {
    if (this.tasks.length === 0) {
      return 0;
    }

    return Math.round((this.completedTasks / this.tasks.length) * 100);
  }

  get taskCompletionCopy(): string {
    if (this.tasks.length === 0) {
      return 'No tasks yet. Create your first task to get started.';
    }

    return `${this.completedTasks} of ${this.tasks.length} tasks completed`;
  }

  get totalClientsCopy(): string {
    return this.totalClients === 1
      ? '1 client in your workspace.'
      : `${this.totalClients} clients in your workspace.`;
  }

  get activeProjectsCopy(): string {
    return this.activeProjects === 0 ? 'No active projects.' : `${this.activeProjects} active projects.`;
  }

  get pendingTasksCopy(): string {
    return this.pendingTasks === 0 ? "You're all caught up." : `${this.pendingTasks} tasks need your attention.`;
  }

  get totalClientsBadge(): MetricBadge | null {
    const clientsCreatedThisMonth = this.clients.filter((client) => this.isCurrentMonth(client.createdAt)).length;

    return clientsCreatedThisMonth > 0
      ? { text: `+${clientsCreatedThisMonth} this month`, tone: 'positive' }
      : null;
  }

  get activeProjectsBadge(): MetricBadge | null {
    const activeProjects = this.projects.filter((project) => project.status !== 'Completed');

    if (activeProjects.length === 0) {
      return null;
    }

    const projectsWithValidDueDates = activeProjects.filter((project) => this.getDaysUntilDue(project.dueDate) !== null);

    if (projectsWithValidDueDates.length === 0) {
      return null;
    }

    const overdueProjects = projectsWithValidDueDates.filter((project) => {
      const daysUntilDue = this.getDaysUntilDue(project.dueDate);
      return daysUntilDue !== null && daysUntilDue < 0;
    }).length;

    if (overdueProjects > 0) {
      return { text: overdueProjects === 1 ? '1 overdue' : `${overdueProjects} overdue`, tone: 'warning' };
    }

    return { text: 'On track', tone: 'positive' };
  }

  get completedProjectsBadge(): MetricBadge | null {
    const projectsCompletedThisMonth = this.projects.filter(
      (project) => project.status === 'Completed' && this.isCurrentMonth(project.updatedAt || project.createdAt)
    ).length;

    return projectsCompletedThisMonth > 0
      ? { text: `+${projectsCompletedThisMonth} this month`, tone: 'positive' }
      : null;
  }

  get pendingTasksBadge(): MetricBadge | null {
    const pendingTasks = this.tasks.filter((task) => task.status !== 'Completed');

    if (pendingTasks.length === 0) {
      return null;
    }

    const urgentTasks = pendingTasks.filter((task) => {
      const daysUntilDue = this.getDaysUntilDue(task.dueDate);
      return task.priority === 'High' || (daysUntilDue !== null && daysUntilDue <= 0);
    }).length;

    if (urgentTasks > 0) {
      return { text: 'Needs attention', tone: 'warning' };
    }

    const dueSoonTasks = pendingTasks.filter((task) => {
      const daysUntilDue = this.getDaysUntilDue(task.dueDate);
      return daysUntilDue !== null && daysUntilDue <= 3;
    }).length;

    return dueSoonTasks > 0 ? { text: `${dueSoonTasks} due soon`, tone: 'neutral' } : null;
  }

  get completedTasksBadge(): MetricBadge | null {
    if (this.tasks.length === 0 || this.completedTasks === 0) {
      return null;
    }

    return { text: `${this.taskCompletionRate}%`, tone: 'positive' };
  }

  get recentActivity(): ActivityItem[] {
    const activity: ActivityItem[] = [];
    const latestClient = this.clients[0];
    const activeProject = this.projects.find((project) => project.status !== 'Completed');
    const completedTask = this.tasks.find((task) => task.status === 'Completed');

    if (latestClient) {
      activity.push({
        title: 'Client created',
        description: `Added ${latestClient.name} to your workspace.`,
        timestamp: latestClient.lastContact,
        tone: 'green',
        icon: 'client'
      });
    }

    if (activeProject) {
      activity.push({
        title: 'Project created',
        description: 'Created a new project.',
        timestamp: activeProject.dueDate,
        tone: 'blue',
        icon: 'approval'
      });
    }

    if (completedTask) {
      activity.push({
        title: 'Task completed',
        description: 'Marked a task as complete.',
        timestamp: completedTask.dueDate,
        tone: 'amber',
        icon: 'report'
      });
    }

    return activity.slice(0, 3);
  }

  get upcomingDeadlines(): DashboardDeadline[] {
    return [
      ...this.projects
        .filter((project) => project.status !== 'Completed')
        .map((project) => ({
          title: project.name,
          label: 'Project',
          dueDate: project.dueDate,
          ...this.getDeadlineMeta(project.dueDate)
        })),
      ...this.tasks
        .filter((task) => task.status !== 'Completed')
        .map((task) => ({
          title: task.title,
          label: 'Task',
          dueDate: task.dueDate,
          ...this.getDeadlineMeta(task.dueDate)
        }))
    ].slice(0, 5);
  }

  get projectStatusOverview(): Array<{ status: ProjectStatus; count: number }> {
    const statuses: ProjectStatus[] = ['Planning', 'In Progress', 'Review', 'Completed'];

    return statuses.map((status) => ({
      status,
      count: this.projects.filter((project) => project.status === status).length
    }));
  }

  get projectStatusTotal(): number {
    return this.projects.length;
  }

  private getDeadlineMeta(dueDate: string): Pick<DashboardDeadline, 'urgency' | 'urgencyLabel'> {
    const daysUntilDue = this.getDaysUntilDue(dueDate);

    if (daysUntilDue === null) {
      return { urgency: 'scheduled', urgencyLabel: 'Scheduled' };
    }

    if (daysUntilDue <= 0) {
      return { urgency: 'due-soon', urgencyLabel: daysUntilDue === 0 ? 'Due today' : 'Overdue' };
    }

    if (daysUntilDue <= 3) {
      return { urgency: 'due-soon', urgencyLabel: `Due in ${daysUntilDue}d` };
    }

    if (daysUntilDue <= 10) {
      return { urgency: 'upcoming', urgencyLabel: `Due in ${daysUntilDue}d` };
    }

    return { urgency: 'scheduled', urgencyLabel: 'Scheduled' };
  }

  private getDaysUntilDue(dueDate: string): number | null {
    const due = new Date(dueDate);

    if (Number.isNaN(due.getTime())) {
      return null;
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());

    return Math.ceil((dueStart.getTime() - todayStart.getTime()) / 86_400_000);
  }

  private isCurrentMonth(dateValue?: string): boolean {
    if (!dateValue) {
      return false;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  private handleLoadError<T>(fallback: T) {
    this.hasApiError = true;
    return of(fallback);
  }
}
