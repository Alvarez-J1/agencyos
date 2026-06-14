import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Client, MOCK_CLIENTS } from '../../data/clients.mock';

@Component({
  selector: 'app-clients',
  imports: [RouterLink],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent {
  searchTerm = '';

  clients = MOCK_CLIENTS;

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
