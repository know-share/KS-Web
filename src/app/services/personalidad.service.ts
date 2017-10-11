import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio de personalidad
 * que se conecta con el api.
 */
@Injectable()
export class PersonalidadService{
    
    baseUrl = URL_API + "/personalidad/";

    constructor(
        private http:Http
    ){}

    /**
	 * Trae todas las personalidades existentes
	 * @param 
	 * @return Lista con las personalidades.
	 */
    getAllPersonalidades(){
        let url = this.baseUrl + "findAll";
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }
}