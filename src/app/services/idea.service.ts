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
        let url = this.baseUrl +'crear/'+ localStorage.getItem('user');
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,idea,{
            headers : header
        })
            .map((res:Response) =>{
                if(res.status == 200){
                    return true;
                }
                if(res.status == 401){
                    throw new Error('No esta autorizado.');
                }
                if(res.status == 400){
                    throw new Error('Null');
                }
                if(res.status == 500){
                    throw new Error('No se pude crear la idea.');
                }
            });
    }

    
}