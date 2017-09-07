import {Http, Response,Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class HabilidadService{
    
    baseUrl = URL_API + "/habilidad/";

    constructor(
        private http:Http
    ){}

    getHabilidades(carrera:string){
        let url = this.baseUrl + `getHabilidades?carrera=${carrera}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }

    getHabilidadesProfesionales(carrera:string){
        let url = this.baseUrl + `getHabilidadesProfesionales?carrera=${carrera}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }
    
    getAll(){
        let url = this.baseUrl + "getAll";
        return this.http.get(url)
            .map((res: Response) => {
                if(res.status == 204)
                    return [];
                return res.json();
            });
    }

    actualizar(habilidad) {
       let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        return this.http.patch(this.baseUrl, habilidad, {
            headers: header
        })
            .map((res: Response) => {
                if (res.status == 200)
                    return 'ok';
                throw Error('Error: ' + res.status);
            }).catch((err: Response) => {
                if (err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    crear(habilidad) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl+"create";
        return this.http.post(url, habilidad, {
            headers: header
        })
            .map((res: Response) => {
                if (res.status == 200)
                    return 'ok';
                throw Error('Error: ' + res.status);
            }).catch((err: Response) => {
                if (err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    eliminar(habilidad){
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl+"delete";
        return this.http.post(url, habilidad.id, {
            headers: header
        })
            .map((res: Response) => {
                if (res.status == 200)
                    return 'ok';
                throw Error('Error: ' + res.status);
            }).catch((err: Response) => {
                if (err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }
    
}