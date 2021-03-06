import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

/**
 * Clase servicio de autenticación
 * que se conecta con el api.
 */
@Injectable()
export class AuthService {

    baseUrl = URL_API + "/auth/";
    loggedIn: boolean;
    isUserAdmin: boolean;

    private logger = new Subject<boolean>();
    private loggerAdmin = new Subject<boolean>();

    constructor(
        private http: Http
    ) { }

    /**
	 * Login de un usuario en el servidor
	 * @param Auth auth
	 * @return true o false según éxito de operación.
	 */
    login(auth) {
        let url = this.baseUrl + "login";
        return this.http.post(url, auth)
            .map((res: Response) => {
                if (res.status == 200) {
                    this.loggedIn = true;
                    this.logger.next(this.loggedIn);
                    if (res.json().role == 'ADMIN') {
                        this.isUserAdmin = true;
                        this.loggerAdmin.next(this.isUserAdmin);
                    }
                    return res.json();
                }
                return null;
            });
    }

    /**
	 * Revisa si existe una sesión valida
	 * @param 
	 * @return true o false según validez.
	 */
    isLoggedIn(): Observable<boolean> {
        return this.logger.asObservable();
    }

    /**
	 * Revisa si la sesión es de tipo admin
	 * @param 
	 * @return true o false según tipo.
	 */
    isAdmin(): Observable<boolean> {
        return this.loggerAdmin.asObservable();
    }

    /**
	 * Cierra la sesión de un usuario
	 * @param 
	 * @return true o false según éxito de operación.
	 */
    logout() {
        let header = new Headers();
        header.append('Authorization', localStorage.getItem('token'));
        let url = this.baseUrl + "logout";
        return this.http.put(url, null, {
            headers: header
        })
            .map((res: Response) => {
                if (res.status == 200) {
                    this.loggedIn = false;
                    this.logger.next(this.loggedIn);
                    this.isUserAdmin = false;
                    this.loggerAdmin.next(this.isUserAdmin);
                    return true;
                }
                throw new Error('Error ' + res.status);
            });
    }
}