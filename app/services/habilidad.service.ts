import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class HabilidadService{
    
    baseUrl = "http://localhost:8081/habilidad/";

    constructor(
        private http:Http
    ){}

    getHabilidades(carrera:string){
        let url = this.baseUrl + `getHabilidades?carrera=${carrera}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }

    getHabilidadesProfesionales(carrera:string){
        let url = this.baseUrl + `getHabilidadesProfesionales?carrera=${carrera}`;
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }
}