import {Http, Response,Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio de habilidad
 * que se conecta con el api.
 */
@Injectable()
export class HabilidadService{
    
    baseUrl = URL_API + "/habilidad/";

    constructor(
        private http:Http
    ){}

    /**
	 * Trae todas las habilidades personales
     * existentes
	 * @param String carrera
	 * @return Lista con las habilidades.
	 */
    getHabilidades(carrera:string){
        let url = this.baseUrl + `getHabilidades?carrera=${carrera}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }

    /**
	 * Trae todas las habilidades 
     * profesionales asociadas a un carrera
	 * @param String carrera
	 * @return Lista con las habilidades.
	 */
    getHabilidadesProfesionales(carrera:string){
        let url = this.baseUrl + `getHabilidadesProfesionales?carrera=${carrera}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }
    
    /**
	 * Trae todas las habilidades 
	 * @param 
	 * @return Lista con las habilidades.
	 */
    getAll(){
        let url = this.baseUrl + "getAll";
        return this.http.get(url)
            .map((res: Response) => {
                if(res.status == 204)
                    return [];
                return res.json();
            });
    }

    /**
	 * Actualiza datos de una habilidad
	 * @param Habilidad habilidad
	 * @return true o false según el éxito de la operación.
	 */
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

    /**
	 * Crea una habilidad
	 * @param Habilidad habilidad
	 * @return true o false según el éxito de la operación.
	 */
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

    /**
	 * Elimina una habilidad
	 * @param Habilidad habilidad
	 * @return true o false según el éxito de la operación.
	 */
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