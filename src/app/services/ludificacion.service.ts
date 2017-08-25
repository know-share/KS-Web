import {Http, Response,Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class LudificacionService{
    
    baseUrl = URL_API + "/ludificacion/";

    constructor(
        private http:Http
    ){}

    avalar(username,tipo,id){
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + `avalar/${username}?tipo=${tipo}`;
        return this.http.put(url, id, {
            headers: header
        })
            .map((res: Response) => {
                if (res.status == 200)
                    return 'ok';
                return 'no modified';
            }).catch((err: Response) => {
                if (err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    getAllCarreras() {
        let url = this.baseUrl + "findAll";
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        return this.http.get(url,{
            headers:header
        })
            .map((res: Response) => {
                return res.json();
            }).catch((err: Response) => {
                if (err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }
}