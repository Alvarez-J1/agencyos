import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Client, MOCK_CLIENTS } from '../../data/clients.mock';

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
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly clientId = Number(this.route.snapshot.paramMap.get('id'));

  client: Client | undefined = MOCK_CLIENTS.find((client) => client.id === this.clientId);

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

  get recentActivity(): ClientActivity[] {
    if (!this.client) {
      return [];
    }

    return this.activities.filter((activity) => activity.clientId === this.client?.id);
  }
}
