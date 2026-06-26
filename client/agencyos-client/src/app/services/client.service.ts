import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';

import { ClientActivity } from '../models/client-activity.model';
import { Client } from '../models/client.model';

export type CreateClientRequest = Pick<Client, 'name' | 'company' | 'email' | 'status'>;
export type UpdateClientRequest = Partial<Omit<Client, '_id' | 'id'>>;

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/clients';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(timeout(8000));
  }

  getClient(id: number | string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }

  getClientActivity(id: number | string): Observable<ClientActivity[]> {
    return this.http.get<ClientActivity[]>(`${this.apiUrl}/${id}/activity`).pipe(timeout(8000));
  }

  createClient(client: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(timeout(8000));
  }

  updateClient(id: number | string, updates: UpdateClientRequest): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, updates).pipe(timeout(8000));
  }

  deleteClient(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }
}
