import {Http, Response,Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio para estadísticas
 * que se conecta con el api.
 */
@Injectable()
export class AdminService{
    
    baseUrl = URL_API + "/admin/";

    constructor(
        private http:Http
    ){}

    /**
	 * Trae todos los usuarios asociados 
     * a una carrera.
	 * @param String carrera
	 * @return Lista con cantidad de hombres y mujeres.
	 */
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

    /**
	 * Trae la cantidad de veces que se usa
     * cada tag.
	 * @param 
	 * @return Mapa con tag y cantidad.
	 */
    getTags() {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + "getTags";
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