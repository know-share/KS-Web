import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class CarreraService {

    baseUrl = URL_API + "/carrera/";

    constructor(
        private http: Http
    ) { }

    getAllCarreras() {
        let url = this.baseUrl + "findAll";
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }

    getEnfasisAreaConocimiento(carrera: string) {
        let url = this.baseUrl + `getEnfasisAreaConocimiento?carrera=${carrera}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }

    actualizar(carrera) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        return this.http.patch(this.baseUrl, carrera, {
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

    actualizarEnfasis(carrera) {
        let url = this.baseUrl + `updateEnfasis`;
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        return this.http.patch(url, carrera, {
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

    eliminar(carrera){
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + `delete/${carrera.id}`;
        return this.http.delete(url, {
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
    
    crear(carrera) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl+"create";
        return this.http.post(url, carrera, {
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