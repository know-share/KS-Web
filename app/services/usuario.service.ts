import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

@Injectable()
export class UsuarioService {

    baseUrl = URL_API + "/usuario/";

    constructor(
        private http: Http
    ) { }

    isUsernameTaken(username: string) {
        let url = this.baseUrl +
            `isUsernameTaken?username=${username}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }

    crearUsuario(usuario) {
        return this.http.post(this.baseUrl,
            usuario).map((res: Response) =>{
                if(res.status == 201)
                    return res.json();
                throw new Error('Error creando al usuario. Intente más tarde.');
            });
    }
}