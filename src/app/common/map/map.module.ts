import { MapComponent } from './map.component';
import { NgModule } from '@angular/core';
import {AgmCoreModule} from '@agm/core';
import { MapOperator } from 'rxjs/operators/map';
import { MapService } from './map.service';
import {CamelizePipe} from 'ngx-pipes';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations:[
        MapComponent
    ],
    exports:[
        MapComponent
    ],
    imports:[
        AgmCoreModule.forRoot({
            apiKey:'AIzaSyBvIMyw9PGlpxLU5BWw_XgpnkCooN4_KiQ'
        }),
        CommonModule
    ],
    providers:[
        MapService,
        CamelizePipe
    ]
})

export class MapModule {}