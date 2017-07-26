import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class RuleService {

    baseUrl = URL_API + "/rules/";

    constructor(
        private http: Http
    ) { }

    recomendacionConexiones(){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `recomendacionConexiones`;
        return this.http.get(url,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200 || res.status == 204)
                    return res.json();
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }
}