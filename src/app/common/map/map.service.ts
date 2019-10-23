import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CamelizePipe} from 'ngx-pipes';

@Injectable()

export class MapService{

    private geoCoder;
    private locationCache:any = {};

    constructor(private camelizePipe:CamelizePipe ){    }
    
    private locationCamelize(location:String):string{
        return this.camelizePipe.transform(location);
    };

    private cacheLocation(location,coordinates){
        const camelizedLocation=this.locationCamelize(location);
        this.locationCache[camelizedLocation]=coordinates;

    };


    private iscachedLocation(location:String):boolean{
        return this.locationCache[this.locationCamelize(location)]
    };

    private geocodeLocation(location:String):Observable<any>{

        if(!this.geoCoder){
            this.geoCoder=new (<any>window).google.maps.GeoCoder();
        }

        return new Observable((observer) => {
            this.geoCoder.geocode({address:location}, (result,status)=>{
                if(status==='OK'){
                    const value=result[0].geometry.location;
                    const coordinates={lat:value.lat(),lng:value.lng()}
                    this.cacheLocation(location,coordinates);
    
                    observer.next(coordinates);
                    console.log(coordinates);
                } else{
                    observer.error('The location was not found');
                }
            });
        });
        
    }

    public getcodeLocation(location :String): Observable<any>{
        
        if (this.iscachedLocation(location)){
                return Observable.of(this.locationCache(this.locationCamelize(location)));
            }else{
                return this.geocodeLocation(location);
            }         
    }
}