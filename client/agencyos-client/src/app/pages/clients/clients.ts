import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  imports: [RouterLink],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  searchTerm = '';
  isLoading = true;
  errorMessage = '';

  clients: Client[] = [];

  ngOnInit(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Clients could not be loaded.';
        this.isLoading = false;
      }
    });
  }

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
