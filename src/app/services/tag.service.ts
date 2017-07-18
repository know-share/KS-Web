import {Http, Response, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class TagService{
    
    baseUrl = URL_API + "/tag/";

    constructor(
        private http:Http
    ){}

    getAllTags(){
        let url = this.baseUrl + "findAll";
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{headers : header})
            .map((res:Response) =>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    throw new Error('No hay tags.');
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar los tags.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }
}