import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

//Services
import { UsuarioService } from '../services/usuario.service';
import { ErrorService } from '../error/error.service';

//Entities
import { Usuario } from '../entities/usuario';
import { Habilidad } from '../entities/habilidad';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    //styleUrls: ['']
})
export class UserComponent implements OnInit{

    username: string;
    activeTab: string;

    habilidadesPersonales: Habilidad[] = [];
    habilidadesProfesionales: Habilidad[] = [];

    usuario: Usuario;

    constructor(
        private activatedRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private errorService: ErrorService,
        private router: Router,
    ){
        this.activeTab = 'ideas';
    }

    ngOnInit(){
        this.usuario = null;
        this.habilidadesPersonales = [];
        this.habilidadesProfesionales = [];
        this.activatedRoute.params.subscribe((params: Params) => {
            this.username = params['username'];
            this.usuarioService.getUsuario(this.username)
                .subscribe(
                    usuario => {
                        this.usuario = usuario;
                        for(let h of usuario.habilidades){
                            if(h.tipo == 'PERSONALES'){
                                this.habilidadesPersonales.push(h);
                            }
                            if(h.tipo == 'PROFESIONALES'){
                                this.habilidadesProfesionales.push(h);
                            }
                        }
                    },error => {
                        this.errorService.updateMessage(error);
                        this.router.navigate(['error']);
                    }
                );
        });
    }

    moveTab(tab){
        this.activeTab = tab;
    }
}