import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';
import { Tag } from './../entities/tag';

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

    buscarUsuario(filtro,param){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `buscarUsuario?filtro=${filtro}&param=${param}`;
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

    update(){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `update`;
        return this.http.put(url,null,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    updateRulesPreferences(state){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `rulesPreferences?state=${state}`;
        return this.http.patch(url,null,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    getRulesPreferences(){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `rulesPreferences`;
        return this.http.get(url,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return res.json();
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    findRed(page){
        let url = this.baseUrl + `findIdeasRed?page=${page}`;
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{
            headers : header
        })
            .map((res : Response)=>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    throw new Error('No hay ideas.');
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar las ideas.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    find(tags:Array<Tag>,criterio:string){
        let url = this.baseUrl + 'buscarIdea' + criterio;
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,tags,{
            headers : header
        })
            .map((res : Response)=>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    return [];
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar las ideas.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }
}