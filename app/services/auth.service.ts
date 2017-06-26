import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService{
    
    baseUrl = "http://localhost:8081/auth/";

    constructor(
        private http:Http
    ){}

    login(auth){
        let url = this.baseUrl + "login";
        return this.http.put(url,auth)
            .map((res:Response )=> {
                if(res.status == 200)
                    return res.json();
                if(res.status == 401)
                    throw new Error('Usuario y contraseña inválidos');
                if(res.status == 400)
                    throw new Error('Null');
            });
    }
}