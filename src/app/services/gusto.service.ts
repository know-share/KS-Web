import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio de gustos
 * que se conecta con el api.
 */
@Injectable()
export class GustoService{
    
    baseUrl = URL_API + "/gusto/";

    constructor(
        private http:Http
    ){}

    /**
	 * Trae todos los gustos
	 * @param 
	 * @return Lista con los gustos.
	 */
    getAllGustos(){
        let url = this.baseUrl + "findAll";
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }
}