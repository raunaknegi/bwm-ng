import {Injectable} from '@angular/core';
import * as moment from 'moment'

@Injectable()

export class helperService{
    private datesRange(startAt,endAt,dateFormat){
        let mstartAt=moment(startAt);
        const mendAt=moment(endAt);
        const tempDates:any[]=[]

        while(mstartAt<mendAt){
            tempDates.push(mstartAt.format(dateFormat));
            mstartAt=mstartAt.add(1,'day')
        }
        tempDates.push(mendAt.format(dateFormat));
        return tempDates;
    }

    private formatDate(date,dateFormat){
        return moment(date).format(dateFormat)
    }

    public bookingDateFormat(date){
        return this.formatDate(date,'YYYY/MM/DD');
    }

    public getBookingRangeOfDates(startAt,endAt){
        return this.datesRange(startAt,endAt,'YYYY/MM/DD')
    }
}