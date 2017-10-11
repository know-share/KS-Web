import {Http, Response,Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio de ludificación
 * que se conecta con el api.
 */
@Injectable()
export class LudificacionService{
    
    baseUrl = URL_API + "/ludificacion/";

    constructor(
        private http:Http
    ){}

    /**
	 * Guarda el aval de un usuario a otro.
     * envía el nombre de usuario avalado, el tipo
     * de usuario que habala y el id de la cualidad o
     * habilidad.
	 * @param String username, String tipo, String id
	 * @return true o false según el éxito de la operación.
	 */
    avalar(username,tipo,id){
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + `avalar/${username}?tipo=${tipo}`;
        return this.http.put(url, id, {
            headers: header
        })
            .map((res: Response) => {
                if (res.status == 200)
                    return 'ok';
                return 'no modified';
            }).catch((err: Response) => {
                if (err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    /**
	 * Trae todas las carreras existentes
     * y su cantidad de estudiantes
	 * @param 
	 * @return Lista con las carreras.
	 */
    getAllCarreras() {
        let url = this.baseUrl + "leaderCarreras";
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
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
	 * Trae todos los usuarios según su tipo,
     * para una carrera especifica
	 * @param String carrera, String tipo
	 * @return true o false según el éxito de la operación.
	 */
    getAllEstudiantes(carrera,tipo ) {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + `leaderUsuarios?carrera=${carrera}&tipo=${tipo}`;
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