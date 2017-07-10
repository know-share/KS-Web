import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

import { ExpirationModalComponent } from '../modals/expiration.component';

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
    isMyProfile: boolean = false;

    //buttons for friendship and follower
    isEnableRequest = true;
    isFollowing = false;
    isEnableFollow = true;
    textRequest = "Agregar como amigo";
    textFollow = "Seguir";
    isFriend:boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private errorService: ErrorService,
        private router: Router,
        private dialogService: DialogService,
    ) {
        this.activeTab = 'ideas';
    }

    ngOnInit() {
        this.usuario = null;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.isMyProfile = false;
            this.isFollowing = false;
            this.isEnableRequest = true;
            this.isEnableFollow = true;
            this.textRequest = "Agregar como amigo";
            this.textFollow = "Seguir";
            this.username = params['username'];
            if(this.username.toLowerCase() == localStorage.getItem('user').toLowerCase())
                this.isMyProfile = true;
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
                    if(this.usuario.amigos
                        .find(amigo => amigo.toLowerCase() == localStorage.getItem("user").toLowerCase())){
                        this.isFriend = true;
                        this.isEnableFollow = false;
                    }
                    this.botonSeguir();
                    this.botonSolicitud();
                }, error => {
                    let disposable;
                    if(error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else{
                        this.errorService.updateMessage(error);
                        this.router.navigate(['error']);
                    }
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

    agregar(){
        this.usuarioService.agregar(this.username)
            .subscribe(
                res => {
                    this.textRequest = "Petición enviada";
                    this.isEnableRequest = false;
                    this.isEnableFollow = false;
                },
                error => {
                    let disposable;
                    if(error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                }
            );
    }

    seguir(){
        if(!this.isFollowing){
            this.usuarioService.seguir(this.username)
                .subscribe(
                    res => {
                        this.textFollow = "Siguiendo";
                        this.isFollowing = true;
                        this.isFriend = true;
                        this.usuario.cantidadSeguidores += 1;
                    },
                    error => {
                        let disposable;
                        if(error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    }
                );
        }else{
            this.usuarioService.dejarSeguir(this.username)
                .subscribe(
                    res => {
                        this.textFollow = "Seguir";
                        this.isFollowing = false;
                        this.isFriend = false;
                        this.usuario.cantidadSeguidores -= 1;
                    },
                    error => {
                        let disposable;
                        if(error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    }
                );
        }
    }

    botonSeguir(){
        let seguidores = this.usuario.seguidores;
        if(seguidores.find(seg => seg.toLowerCase() == localStorage.getItem("user").toLowerCase())){
            this.textFollow = "Siguiendo";
            this.isFollowing = true;
            this.isFriend = true;
        }
    }

    botonSolicitud(){
        let solicitudes:string[] = this.usuario.solicitudesAmistad;
        if(solicitudes && 
            solicitudes.find(value => value.toLowerCase() == localStorage.getItem("user").toLowerCase())){
            this.isEnableRequest = false;
            this.textRequest = "Petición enviada";
            this.isEnableFollow = false;
        }else {
            let usu:Usuario = JSON.parse(localStorage.getItem("dto"));
            solicitudes = usu.solicitudesAmistad;
            if(solicitudes && 
                solicitudes.find(value => value.toLowerCase() == this.username.toLowerCase())){
                this.isEnableRequest = false;
                this.textRequest = "Petición pendiente";
                this.isEnableFollow = false;
            }
        }
    }
}