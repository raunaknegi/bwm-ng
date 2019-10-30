import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment'

class DecodedToken{
    exp:number=0;
    userName:string='';
}

@Injectable()
export class AuthService {

    constructor(private http:HttpClient){ 
        this.decodedToken=JSON.parse(localStorage.getItem('bwm_meta'))||new DecodedToken();
    };

    private decodedToken;

    private saveToken(token:string): string{
        this.decodedToken=jwt.decode(token)
        
        localStorage.setItem('bwm_auth',token);
        localStorage.setItem('bwm_meta',JSON.stringify(this.decodedToken));
        return token;
    }

    private getExpiration(){
       return moment.unix(this.decodedToken.exp);
    }
    public register(userData:any): Observable<any>{
        return this.http.post('/api/user/register',userData)           
        
    };

    public loginService(loginData:any):Observable<any>{
        return this.http.post('/api/user/auth',loginData).map(
            (token:string)=>{
                return this.saveToken(token)
             });             
    }
    
    public isAuthenticated():boolean{
        return moment().isBefore(this.getExpiration());
    }

    public logout(){
        localStorage.removeItem('bwm_auth');
        localStorage.removeItem('bwm_meta');
        this.decodedToken=new DecodedToken();
    }

    public getToken(){
        return localStorage.getItem('bwm_auth');
    }

    public getUsername(){
       return this.decodedToken.userName;
    }


    
}




