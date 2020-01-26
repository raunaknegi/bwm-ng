import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/shared/auth.service';

@Injectable()
export class UserService {

  constructor(private http:HttpClient,
              private auth:AuthService) { }

  public getUserId(userId):Observable<any>{
    return this.http.get('/api/user/'+userId);
  }

}
