import { Http, Response, Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

import {Idea} from '../entities/idea';

@Injectable()
export class IdeaService{
    
    baseUrl = URL_API + "/idea/";

    constructor(
        private http: Http
    ){}

    crearIdea(idea){
        let url = this.baseUrl +'crear';
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,idea,{
            headers : header
        })
            .map((res:Response) =>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 500){
                    throw new Error('No se pude crear la idea.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    
}