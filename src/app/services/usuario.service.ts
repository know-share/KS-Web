import { Http, Response, Headers } from '@angular/http';
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
                    return true;
                throw new Error('Error creando al usuario. Intente más tarde.');
            });
    }

    getUsuario(username){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `get/${username}`;
        return this.http.get(url,{
            headers : header
        })
            .map((res: Response) => {
                if(res.status == 204)
                    throw Error('Usuario no encontrado.');
                if(res.status == 200)
                    return res.json();
            })
            .catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    agregar(usernameObj){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `solicitud/${usernameObj}`;
        return this.http.put(url,null,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    accionSobreSolicitud(username,accion){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `solicitud/${username}?action=${accion}`;
        return this.http.put(url,null,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    seguir(usernameObj){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `seguir/${usernameObj}`;
        return this.http.put(url,null,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    dejarSeguir(usernameObj){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `dejarseguir/${usernameObj}`;
        return this.http.put(url,null,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    addTG(tg){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `addTG`;
        return this.http.post(url,tg,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 201)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    addFormacionAcademica(fa){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `addFormacionAcademica`;
        return this.http.post(url,fa,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 201)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    eliminarAmigo(username){
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        let url = this.baseUrl + `eliminarAmigo/${username}`;
        return this.http.put(url,null,{
            headers: header
        })
            .map((res: Response) =>{
                if(res.status == 200)
                    return 'ok';
                throw Error('Error: '+res.status);
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }
}