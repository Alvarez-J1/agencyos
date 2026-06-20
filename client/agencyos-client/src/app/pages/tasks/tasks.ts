import { Component, inject, OnInit } from '@angular/core';

import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class TasksComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  searchTerm = '';
  selectedStatus: TaskStatus | 'All' = 'All';
  selectedPriority: TaskPriority | 'All' = 'All';
  isLoading = true;
  errorMessage = '';

  statusOptions: Array<TaskStatus | 'All'> = ['All', 'Todo', 'In Progress', 'Completed'];
  priorityOptions: Array<TaskPriority | 'All'> = ['All', 'Low', 'Medium', 'High'];

  tasks: Task[] = [];

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Tasks could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  get filteredTasks(): Task[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.tasks.filter((task) => {
      const matchesSearch =
        !search ||
        [task.title, task.project, task.assignee, task.priority, task.status, task.dueDate].some((value) =>
          value.toLowerCase().includes(search)
        );

      const matchesStatus = this.selectedStatus === 'All' || task.status === this.selectedStatus;
      const matchesPriority = this.selectedPriority === 'All' || task.priority === this.selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value as TaskStatus | 'All';
  }

  onPriorityChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPriority = select.value as TaskPriority | 'All';
  }

  markComplete(taskId: number): void {
    this.tasks = this.tasks.map((task) => (task.id === taskId ? { ...task, status: 'Completed' } : task));
  }
}
