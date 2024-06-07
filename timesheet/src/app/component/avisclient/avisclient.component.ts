import { Component, OnInit } from '@angular/core';
import { Client } from '../client-profile/client-profile.component';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-avisclient',
  templateUrl: './avisclient.component.html',
  styleUrls: ['./avisclient.component.css']
})
export class AvisclientComponent implements OnInit {
  reviews: Client[] = [];

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.reviewService.getReviews().subscribe(reviews => this.reviews = reviews);
  }

}
