import { Component, OnInit,Input} from '@angular/core';
import {MapService} from './map.service';


@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() location:string;
  lat : Number;
  lng : Number;

  islocation:boolean=false;

  constructor(private mapService:MapService) { }

  ngOnInit() { }

  mapReadyHandler(){
    this.mapService.getcodeLocation(this.location).subscribe(
      (coordinates) => {

        this.lat=coordinates.lat;
        this.lng=coordinates.lng;
      },()=> {
        this.islocation=true;
      });
  }
  

}
