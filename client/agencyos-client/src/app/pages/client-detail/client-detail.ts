import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-detail',
  imports: [RouterLink],
  templateUrl: './client-detail.html'
})
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);

  clientId = this.route.snapshot.paramMap.get('id') ?? 'unknown';
}
