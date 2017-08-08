import { TrabajoGrado } from './../entities/trabajoGrado';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class TrabajoGradoService {

    baseUrl = URL_API + "/tg/";

    constructor(
        private http: Http
    ) {}

    findAll(){
        let url = this.baseUrl + "findAll";
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }
}