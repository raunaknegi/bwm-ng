import { Component, OnInit,Input, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {MapService} from './map.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,OnDestroy {

  @Input() location:string;
  @Input() updatedLocation:Subject<any>;
  lat : Number;
  lng : Number;

  islocation:boolean=false;

  constructor(private mapService:MapService,
              private ref:ChangeDetectorRef) { }

  ngOnInit() { 
    if(this.updatedLocation){
      this.updatedLocation.subscribe((location:string)=>{
        this.getLocation(location)
      });
    }    
  }

  ngOnDestroy(){
    if(this.updatedLocation){
      this.updatedLocation.unsubscribe();
    }
  }

  getLocation(location){
    this.mapService.getcodeLocation(location).subscribe(
      (coordinates) => {
        this.lat=coordinates.lat;
        this.lng=coordinates.lng;

        this.ref.detectChanges()
      },()=> {
        this.islocation=true;
      });
  }

  mapReadyHandler(){
    this.getLocation(this.location)
  }
  

}
