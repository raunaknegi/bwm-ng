import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class ImageUploadService {

  constructor(private http:HttpClient) { }

  public uploadImage(image:File):Observable<string | any>{
    debugger;

    const formData=new FormData();
    formData.append('image',image)

    return this.http.post('/api/image-upload',formData).pipe(map(((json: any) =>  json.imageUrl)));
  }

}
