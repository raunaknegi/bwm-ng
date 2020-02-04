import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Review } from './shared/review.model';
import { ReviewService } from './shared/review.service';


@Component({
  selector: 'bwm-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  constructor(private modalService:NgbModal,
              private reviewService:ReviewService) { }

  @Input() bookingId:string;
  @Output() ratingSubmited=new EventEmitter();

  review:Review={text:'',rating:3};
  modalref:any;
  error:any[]
  ngOnInit() {
  }

  handleRatingChange(event){
    this.review.rating=event.rating;
  }

  openReviewModal(content){
    this.modalref=this.modalService.open(content)
  }

  confirmReview(){
    debugger;
    this.reviewService.createReview(this.review,this.bookingId).subscribe(
      (review:Review)=>{
        this.ratingSubmited.emit(review);
        this.modalref.close();
      },
      (errorResponse)=>{
        this.error=errorResponse.error.errors;
      }
    )
  }

}
