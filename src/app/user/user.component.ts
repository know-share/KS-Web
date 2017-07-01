import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

//Services
import { UsuarioService } from '../services/usuario.service';
import { ErrorService } from '../error/error.service';

//Entities
import { Usuario } from '../entities/usuario';
import { Habilidad } from '../entities/habilidad';
import { AreaConocimiento } from '../entities/areaConocimiento';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    username: string;
    activeTab: string;

    habilidadesPersonales: Habilidad[] = [];

    habilidadesProfesionales: Habilidad[] = [];
    habilidadesProfesionalesSeg: Habilidad[] = [];

    areasConocimiento: AreaConocimiento[] = [];
    areasConocimientoSeg: AreaConocimiento[] = [];

    usuario: Usuario;

    constructor(
        private activatedRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private errorService: ErrorService,
        private router: Router,
    ) {
        this.activeTab = 'ideas';
    }

    ngOnInit() {
        this.usuario = null;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.username = params['username'];
            this.usuarioService.getUsuario(this.username)
                .subscribe(
                usuario => {
                    this.habilidadesPersonales = [];
                    this.habilidadesProfesionales = [];
                    this.habilidadesProfesionalesSeg = [];
                    this.areasConocimiento = [];
                    this.areasConocimientoSeg = [];
                    this.usuario = usuario;
                    this.mapAreasConocimiento(usuario.areasConocimiento);
                    for (let h of usuario.habilidades) {
                        if (h.tipo == 'PERSONALES') {
                            this.habilidadesPersonales.push(h);
                        }
                        if (h.tipo == 'PROFESIONALES' && h.carrera == this.usuario.carrera.nombre) {
                            this.habilidadesProfesionales.push(h);
                        }
                        if (this.usuario.segundaCarrera && h.tipo == 'PROFESIONALES' && h.carrera == this.usuario.segundaCarrera.nombre) {
                            this.habilidadesProfesionalesSeg.push(h);
                        }
                    }
                }, error => {
                    this.errorService.updateMessage(error);
                    this.router.navigate(['error']);
                }
                );
        });
    }

    mapAreasConocimiento(areasConocimiento: AreaConocimiento[]) {
        this.areasConocimiento = []; this.areasConocimientoSeg = [];
        for (let ac of areasConocimiento) {
            if (ac.carrera == this.usuario.carrera.nombre) {
                this.areasConocimiento.push(ac);
            }
            if (this.usuario.segundaCarrera && ac.carrera == this.usuario.segundaCarrera.nombre) {
                this.areasConocimientoSeg.push(ac);
            }
        }
    }

    moveTab(tab) {
        this.activeTab = tab;
    }
}