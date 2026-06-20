import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

type ClientActivity = {
  id: number;
  clientId: number;
  title: string;
  date: string;
  note: string;
};

@Component({
  selector: 'app-client-detail',
  imports: [RouterLink],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss'
})
export class ClientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);

  private readonly clientId = Number(this.route.snapshot.paramMap.get('id'));

  client: Client | undefined;
  isLoading = true;
  errorMessage = '';

  activities: ClientActivity[] = [
    {
      id: 1,
      clientId: 1,
      title: 'Reviewed homepage mockups',
      date: 'Jun 10, 2026',
      note: 'Client approved the direction and requested smaller testimonial cards.'
    },
    {
      id: 2,
      clientId: 1,
      title: 'Sent project timeline',
      date: 'Jun 7, 2026',
      note: 'Shared the revised launch plan for the redesign sprint.'
    },
    {
      id: 3,
      clientId: 2,
      title: 'Completed onboarding call',
      date: 'Jun 8, 2026',
      note: 'Captured goals, audience notes, and first campaign requirements.'
    },
    {
      id: 4,
      clientId: 3,
      title: 'Prepared monthly report',
      date: 'Jun 4, 2026',
      note: 'Summarized content updates and open retainer tasks.'
    },
    {
      id: 5,
      clientId: 4,
      title: 'Paused active work',
      date: 'May 29, 2026',
      note: 'Moved current requests to backlog until the client resumes.'
    }
  ];

  ngOnInit(): void {
    this.clientService.getClient(this.clientId).subscribe({
      next: (client) => {
        this.client = client;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Client could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  get recentActivity(): ClientActivity[] {
    if (!this.client) {
      return [];
    }

    return this.activities.filter((activity) => activity.clientId === this.client?.id);
  }
}
