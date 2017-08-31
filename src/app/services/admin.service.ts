import {Http, Response,Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class AdminService{
    
    baseUrl = URL_API + "/admin/";

    constructor(
        private http:Http
    ){}


    getAllUsuarios(carrera ) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + `getUsuarios?carrera=${carrera}`;
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