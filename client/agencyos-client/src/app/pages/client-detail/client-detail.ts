import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { ClientActivity } from '../../models/client-activity.model';
import { Client, ClientStatus } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss'
})
export class ClientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);

  private readonly clientId = this.route.snapshot.paramMap.get('id') ?? '';

  client: Client | undefined;
  editClient: Client | undefined;
  isLoading = true;
  isEditing = false;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  actionMessage = '';
  activities: ClientActivity[] = [];

  readonly statusOptions: ClientStatus[] = ['Active', 'Onboarding', 'Paused'];

  ngOnInit(): void {
    forkJoin({
      client: this.clientService.getClient(this.clientId),
      activities: this.clientService.getClientActivity(this.clientId).pipe(catchError(() => of([] as ClientActivity[])))
    }).subscribe({
      next: ({ client, activities }) => {
        this.client = client;
        this.editClient = { ...client };
        this.activities = activities;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Client could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  get recentActivity(): ClientActivity[] {
    return this.activities;
  }

  formatActivityDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  startEditing(): void {
    if (!this.client) {
      return;
    }

    this.editClient = { ...this.client };
    this.isEditing = true;
    this.errorMessage = '';
    this.actionMessage = '';
  }

  cancelEditing(): void {
    this.editClient = this.client ? { ...this.client } : undefined;
    this.isEditing = false;
    this.errorMessage = '';
  }

  saveClient(): void {
    if (!this.editClient) {
      return;
    }

    if (!this.editClient.name.trim() || !this.editClient.company.trim() || !this.editClient.email.trim()) {
      this.errorMessage = 'Name, company, and email are required.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.actionMessage = '';

    this.clientService
      .updateClient(this.clientId, {
        name: this.editClient.name,
        company: this.editClient.company,
        email: this.editClient.email,
        status: this.editClient.status,
        activeProjects: Number(this.editClient.activeProjects),
        lastContact: this.editClient.lastContact
      })
      .subscribe({
        next: (client) => {
          this.client = client;
          this.editClient = { ...client };
          this.isEditing = false;
          this.isSaving = false;
          this.actionMessage = 'Client updated.';
          this.loadActivity();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Client could not be updated.';
          this.isSaving = false;
        }
      });
  }

  deleteClient(): void {
    if (!this.client || !confirm(`Delete ${this.client.name}? This cannot be undone.`)) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.clientService.deleteClient(this.clientId).subscribe({
      next: () => {
        this.router.navigateByUrl('/clients');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigateByUrl('/clients');
          return;
        }

        this.errorMessage = error.error?.message || 'Client could not be deleted.';
        this.isDeleting = false;
      }
    });
  }

  private loadActivity(): void {
    this.clientService
      .getClientActivity(this.clientId)
      .pipe(catchError(() => of([] as ClientActivity[])))
      .subscribe({
        next: (activities) => {
          this.activities = activities;
        }
      });
  }
}
