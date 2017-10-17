import {Http, Response, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio de tag
 * que se conecta con el api.
 */
@Injectable()
export class TagService{
    
    baseUrl = URL_API + "/tag/";

    constructor(
        private http:Http
    ){}

    /**
	 * Trae todos los tags existentes
	 * @param 
	 * @return Lista con los tags.
	 */
    getAllTags(){
        let url = this.baseUrl + "findAll";
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{headers : header})
            .map((res:Response) =>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    return [];
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar los tags.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    /**
	 * Crea un tag
	 * @param Tag tag
	 * @return true o false según el éxito de la operación.
	 */
     crear(tag) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl+"create";
        return this.http.post(url, tag.nombre, {
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
	 * Actualiza un tag
	 * @param Tag tag
	 * @return true o false según el éxito de la operación.
	 */
    actualizar(tag){
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        return this.http.patch(this.baseUrl, tag, {
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
	 * Elimina un tag
	 * @param Tag tag
	 * @return true o false según el éxito de la operación.
	 */
    eliminar(tag){
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + `delete/${tag.id}`;
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
}