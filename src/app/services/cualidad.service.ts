import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio de cualidades
 * que se conecta con el api.
 */
@Injectable()
export class CualidadService{
    
    baseUrl = URL_API + "/cualidad/";

    constructor(
        private http:Http
    ){}

    /**
	 * Trae todas las cualidades
	 * @param 
	 * @return Lista con las cualidades.
	 */
    getAllCualidades(){
        let url = this.baseUrl + "findAll";
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }
}