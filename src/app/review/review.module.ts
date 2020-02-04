import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { FormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
import { ReviewService } from './shared/review.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StarRatingModule.forRoot()
  ],
  declarations: [
    ReviewComponent
  ],
  exports:[
    ReviewComponent
  ],
  providers:[
    ReviewService
  ]
})
export class ReviewModule { }
