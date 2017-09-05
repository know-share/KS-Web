import { IdeaHome } from './../entities/ideaHome';
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

import { ExpirationModalComponent } from '../modals/expiration.component';

//Services
import { UsuarioService } from '../services/usuario.service';
import { ErrorService } from '../error/error.service';
import { IdeaService } from '../services/idea.service';
import { LudificacionService } from '../services/ludificacion.service';

//Entities
import { Usuario } from '../entities/usuario';
import { Habilidad } from '../entities/habilidad';
import { AreaConocimiento } from '../entities/areaConocimiento';
import { Idea } from '../entities/idea';
import { URL_IMAGE_USER } from '../entities/constants';

//primeng
import { Message } from 'primeng/primeng';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    imagePath: string;

    serverUri = URL_IMAGE_USER;

    username: string;
    activeTab: string;

    habilidadesPersonales: Habilidad[] = [];

    habilidadesProfesionales: Habilidad[] = [];
    habilidadesProfesionalesSeg: Habilidad[] = [];

    areasConocimiento: AreaConocimiento[] = [];
    areasConocimientoSeg: AreaConocimiento[] = [];
    ideas: Idea[] = [];

    usuario: Usuario;
    isMyProfile: boolean = false;

    //buttons for friendship and follower
    isEnableRequest = true;
    isFollowing = false;
    isEnableFollow = true;
    textRequest = "Agregar como amigo";
    textFollow = "Seguir";
    isFriend: boolean = false;

    msgs: Message[] = [];

    constructor(
        private ideaService: IdeaService,
        private activatedRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private errorService: ErrorService,
        private router: Router,
        private dialogService: DialogService,
        private ludificacionService: LudificacionService,
    ) {
        this.activeTab = 'ideas';
    }

    ngOnInit() {
        this.usuario = null;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.isMyProfile = false;
            this.isFollowing = false;
            this.isFriend = false;
            this.isEnableRequest = true;
            this.isEnableFollow = true;
            this.textRequest = "Agregar como amigo";
            this.textFollow = "Seguir";
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
                    if (this.usuario.amigos
                        .find(amigo => amigo.username.toLowerCase() == localStorage.getItem("user").toLowerCase())) {
                        this.isFriend = true;
                        this.isEnableFollow = false;
                    }
                    if (this.username.toLowerCase() == localStorage.getItem('user').toLowerCase())
                        this.isMyProfile = true;
                    if (!this.isMyProfile) {
                        this.botonSeguir();
                        this.botonSolicitud();
                        this.reloadImage();
                        this.refreshIdeas();
                    }
                }, error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else {
                        this.errorService.updateMessage(error);
                        this.router.navigate(['error']);
                    }
                }
                );
        });
    }

    refreshIdeas() {
        this.ideaService.findByUsuario(this.username)
            .subscribe((res: any[]) => {
                this.ideas = res;
            }, error => {
                console.log('Error' + error);
            });
    }

    reloadImage() {
        if (this.usuario.imagen) {
            this.imagePath = URL_IMAGE_USER + this.usuario.username;
        } else {
            if (this.usuario.genero == 'Femenino')
                this.imagePath = "images/icons/woman.png";
            else
                this.imagePath = "images/icons/dude4_x128.png";
        }
    }

    imageCard(username, genero): string {
        if (genero == 'Femenino')
            return "images/icons/woman.png";
        else
            return "images/icons/dude4_x128.png";
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

    agregar() {
        this.usuarioService.agregar(this.username)
            .subscribe(
            res => {
                this.textRequest = "Petición enviada";
                this.isEnableRequest = false;
                this.isEnableFollow = false;
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            }
            );
    }

    refreshUsuario() {
        this.usuarioService.getUsuario(this.usuario.username)
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
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            }
            );
    }

    seguir() {
        if (!this.isFollowing) {
            this.usuarioService.seguir(this.username)
                .subscribe(
                res => {
                    this.textFollow = "Siguiendo";
                    this.isFollowing = true;
                    this.isFriend = true;
                    this.refreshUsuario();
                },
                error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                }
                );
        } else {
            this.usuarioService.dejarSeguir(this.username)
                .subscribe(
                res => {
                    this.textFollow = "Seguir";
                    this.isFollowing = false;
                    this.isFriend = false;
                    this.refreshUsuario();
                },
                error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else
                        console.log('error: ' + error);
                }
                );
        }
    }

    botonSeguir() {
        let seguidores = this.usuario.seguidores;
        if (seguidores.find(seg => seg.username.toLowerCase() == localStorage.getItem("user").toLowerCase())) {
            this.textFollow = "Siguiendo";
            this.isFollowing = true;
            this.isFriend = true;
        }
    }

    botonSolicitud() {
        let solicitudes: string[] = this.usuario.solicitudesAmistad;
        if (solicitudes &&
            solicitudes.find(value => value.toLowerCase() == localStorage.getItem("user").toLowerCase())) {
            this.isEnableRequest = false;
            this.textRequest = "Petición enviada";
            this.isEnableFollow = false;
        } else {
            let usu: Usuario = JSON.parse(localStorage.getItem("dto"));
            solicitudes = usu.solicitudesAmistad;
            if (solicitudes &&
                solicitudes.find(value => value.toLowerCase() == this.username.toLowerCase())) {
                this.isEnableRequest = false;
                this.textRequest = "Petición pendiente";
                this.isEnableFollow = false;
            }
        }
    }

    goProfile(username) {
        this.router.navigate(['/user', username]);
    }

    search() {
        this.router.navigate(['/search']);
    }

    errorImageHandler(event, username, genero) {
        event.target.src = this.imageCard(username, genero);
    }

    cambio(confirm: IdeaHome) {
        let temp: Array<Idea> = new Array;
        if (confirm != null) {
            let i = this.ideas.indexOf(confirm.idea);
            this.ideaService.findById(confirm.idea.id)
                .subscribe((res: Idea) => {
                    if (confirm.operacion === "compartir") {
                        temp.push(res);
                        temp = temp.concat(this.ideas);
                        this.ideas = temp;
                    } else {
                        this.ideas.splice(i, 1, res);
                    }
                }, error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                })
        } else {
            //pop up con error
        }
    }

    avalar(id, tipo) {
        this.ludificacionService.avalar(this.username, tipo, id)
            .subscribe(
            ok => {
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Operación completada', detail: 'Felicidades, has dado tu aval.' });
                this.refreshUsuario();
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else{
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Operación no completada', detail: 'Solo puedes dar un aval por cualidad/habilidad.' });
                }
            });
    }
}