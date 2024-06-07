import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Client } from '../component/client-profile/client-profile.component';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private clients: Client[] = [];

  constructor() { }

  addReview(client: Client): void {
    this.clients.push(client);
  }

  getReviews(): Observable<Client[]> {
    return of(this.clients);
  }
}
