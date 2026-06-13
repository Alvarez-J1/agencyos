import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type ClientStatus = 'Active' | 'Onboarding' | 'Paused';

type Client = {
  id: number;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  activeProjects: number;
  lastContact: string;
};

@Component({
  selector: 'app-clients',
  imports: [RouterLink],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent {
  searchTerm = '';

  clients: Client[] = [
    {
      id: 1,
      name: 'Maya Chen',
      company: 'Northstar Studio',
      email: 'maya@northstar.example',
      status: 'Active',
      activeProjects: 3,
      lastContact: 'Jun 10, 2026'
    },
    {
      id: 2,
      name: 'Jordan Ellis',
      company: 'BrightPath Coaching',
      email: 'jordan@brightpath.example',
      status: 'Onboarding',
      activeProjects: 2,
      lastContact: 'Jun 8, 2026'
    },
    {
      id: 3,
      name: 'Priya Raman',
      company: 'Harbor Legal Group',
      email: 'priya@harborlegal.example',
      status: 'Active',
      activeProjects: 1,
      lastContact: 'Jun 4, 2026'
    },
    {
      id: 4,
      name: 'Marcus Lee',
      company: 'Summit Fitness Co.',
      email: 'marcus@summitfitness.example',
      status: 'Paused',
      activeProjects: 0,
      lastContact: 'May 29, 2026'
    }
  ];

  get filteredClients(): Client[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      return this.clients;
    }

    return this.clients.filter((client) =>
      [
        client.name,
        client.company,
        client.email,
        client.status,
        client.activeProjects.toString(),
        client.lastContact
      ].some((value) => value.toLowerCase().includes(search))
    );
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }
}
