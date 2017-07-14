import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//primeng
import {Message} from 'primeng/primeng';

//Services
import { UsuarioService } from '../services/usuario.service';
import { ErrorService } from '../error/error.service';

//Entities
import { Usuario } from '../entities/usuario';
import { Habilidad } from '../entities/habilidad';
import { AreaConocimiento } from '../entities/areaConocimiento';

import { EditCarreraModalComponent } from '../modals/edit-carrera.component';
import { AddTGModalComponent } from '../modals/add-tg.component';
import { AddFAModalComponent } from '../modals/add-fa.component';
import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./user.component.css']
})
export class ProfileComponent implements OnInit {

    @Input() usuario: Usuario;
    activeTab: string;

    habilidadesPersonales: Habilidad[] = [];

    habilidadesProfesionales: Habilidad[] = [];
    habilidadesProfesionalesSeg: Habilidad[] = [];

    areasConocimiento: AreaConocimiento[] = [];
    areasConocimientoSeg: AreaConocimiento[] = [];

    msgs: Message[] = [];

    constructor(
        private dialogService: DialogService,
        private usuarioService: UsuarioService,
        private router:Router,
    ) { }

    ngOnInit() {
        this.activeTab = 'ideas';
        this.habilidadesPersonales = [];
        this.habilidadesProfesionales = [];
        this.habilidadesProfesionalesSeg = [];
        this.areasConocimiento = [];
        this.areasConocimientoSeg = [];
        this.mapAreasConocimiento(this.usuario.areasConocimiento);
        for (let h of this.usuario.habilidades) {
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

    addTG() {
        let disposable = this.dialogService.addDialog(AddTGModalComponent).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Trabajo de grado agregado.'});
                }
            });
    }

    addFormacion() {
        let disposable = this.dialogService.addDialog(AddFAModalComponent).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Formación académica agregada.'});
                }
            });
    }

    editCarrera(carrera) {
        let disposable = this.dialogService.addDialog(EditCarreraModalComponent, {
            usuario: this.usuario
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    //this.refreshSolicitudes();
                    console.log('');
                }
            });
    }

    refreshUsuario() {
        this.usuarioService.getUsuario(localStorage.getItem('user'))
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

    goProfile(username){
        this.router.navigate(['/user',username]);
    }

    eliminarAmigo(username){
        this.usuarioService.eliminarAmigo(username)
            .subscribe(
                ok => this.refreshUsuario()
                ,error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else
                        console.log('error: '+error);
                }
            )
    }
}