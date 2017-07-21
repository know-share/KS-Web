import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';
import { CarreraService } from '../services/carrera.service';
import { HabilidadService } from '../services/habilidad.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Carrera } from '../entities/carrera';
import { Usuario } from '../entities/usuario';
import { EnfasisAC } from '../entities/enfasisAC';
import { Enfasis } from '../entities/enfasis';
import { Habilidad } from '../entities/habilidad';
import { AreaConocimiento } from '../entities/areaConocimiento';

export interface RequestModalDisplay {
    usuario: Usuario;
}

@Component({
    selector: 'confirm',
    templateUrl: './edit-carrera.component.html',
    styleUrls: ['../access/signup.component.css','./edit-carrera.component.css']
})
export class EditCarreraModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    usuario: Usuario;

    loading: boolean = false;

    carrera: Carrera;
    enfasisPrincipal: Enfasis;
    enfasisSecundario: Enfasis;
    acSelected: AreaConocimiento[] = [];
    habilidadesSelected: Habilidad[] = [];

    habilidadesOriginales: Habilidad[] = [];
    areasConocimientoOtraCarrera: AreaConocimiento[] = [];

    carreras: Carrera[] = [];
    enfasisCarrera: Enfasis[] = [];
    areasConocimiento: AreaConocimiento[] = [];
    habilidadesProfesionales: Habilidad[] = [];

    constructor(
        dialogService: DialogService,
        private router: Router,
        private usuarioService: UsuarioService,
        private carreraService: CarreraService,
        private habilidadService: HabilidadService,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.loadPersistentInfo();
        this.carreras = [];
        this.habilidadesProfesionales = [];
        this.loading = true;
        this.carreraService.getAllCarreras()
            .subscribe(
            carreras => {
                this.carreras = carreras;
                this.carrera = this.carreras.find(c => c.nombre == this.usuario.carrera.nombre);
                this.loading = false;
                this.getEnfasis();
                this.getHabilidades();
            }, error => this.loading = false
            );
    }

    loadPersistentInfo(){
        this.habilidadesOriginales = [];
        this.areasConocimientoOtraCarrera= [];
        let carreraActual = this.usuario.carrera.nombre;
        for(let h of this.usuario.habilidades){
            if(h.tipo == 'PERSONALES' || h.carrera != carreraActual)
                this.habilidadesOriginales.push(h);
        }
        for(let ac of this.usuario.areasConocimiento){
            if(ac.carrera != carreraActual)
                this.areasConocimientoOtraCarrera.push(ac);
        }
    }

    isCheckWithId(item, list) {
        return list.find(obj => obj.id == item.id) == null ? false : true;
    }

    isCheck(item, list) {
        return list.find(obj => obj.nombre == item.nombre) == null ? false : true;
    }

    checkHabilidades(h) {
        if (this.habilidadesSelected.find(obj => obj.id == h.id) == null)
            this.habilidadesSelected.push(h);
        else
            this.habilidadesSelected = this.habilidadesSelected.filter(obj => obj.id != h.id);
    }

    checkAC(ac){
        if (this.acSelected.find(obj => obj.nombre == ac.nombre) == null)
            this.acSelected.push(ac);
        else
            this.acSelected = this.acSelected.filter(obj => obj.nombre != ac.nombre);
    }

    onChangeCarrera() {
        this.getEnfasis();
        this.getHabilidades();
    }

    getEnfasis() {
        this.enfasisCarrera = [];
        this.acSelected = [];
        this.areasConocimiento = [];
        this.loading = true;
        this.carreraService.getEnfasisAreaConocimiento(this.carrera.nombre)
            .subscribe(
            enfasisAC => {
                for (let e of enfasisAC.enfasis) {
                    let enf: Enfasis = new Enfasis();
                    enf.carrera = this.carrera.nombre;
                    enf.nombre = e;
                    this.enfasisCarrera.push(enf);
                }
                this.enfasisPrincipal = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[0].nombre);
                if (this.usuario.enfasis[1])
                    this.enfasisSecundario = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[1].nombre);
                else
                    this.enfasisSecundario = null;
                if (!this.enfasisPrincipal)
                    this.enfasisPrincipal = this.enfasisCarrera[0];
                if (!this.enfasisSecundario)
                    this.enfasisSecundario = null;

                //--------------------------------------------------------
                for (let ac of enfasisAC.areaConocimiento) {
                    let acNew: AreaConocimiento = new AreaConocimiento();
                    acNew.carrera = this.usuario.carrera.nombre;
                    acNew.nombre = ac;
                    this.areasConocimiento.push(acNew);

                    let acUsuario = this.usuario.areasConocimiento.find(a => a.nombre == ac);
                    if (acUsuario) {
                        this.acSelected.push(acUsuario);
                    }
                }
                this.loading = false;
            },
            error => this.loading = false
            )
    }

    getHabilidades() {
        this.loading = true;
        this.habilidadesSelected = [];
        this.habilidadService.getHabilidadesProfesionales(this.carrera.nombre)
            .subscribe(
            habilidades => {
                this.habilidadesProfesionales = habilidades;
                for (let h of this.habilidadesProfesionales) {
                    if (this.usuario.habilidades.find(hp => hp.nombre == h.nombre)) {
                        this.habilidadesSelected.push(h);
                    }
                }
                this.loading = false;
            }, error => this.loading = false
            );
    }

    confirm() {
        let dto: Usuario = new Usuario();
        dto.id = this.usuario.id;
        dto.tipoUsuario = this.usuario.tipoUsuario;
        dto.carrera = this.carrera;
        dto.enfasis = this.usuario.enfasis;
        dto.enfasis[0] = this.enfasisPrincipal;
        dto.enfasis[1] = this.enfasisSecundario;
        dto.areasConocimiento = this.areasConocimientoOtraCarrera.concat(this.acSelected);
        dto.habilidades = this.habilidadesOriginales.concat(this.habilidadesSelected);
        this.usuarioService.actualizarInfoAcademica(dto)
            .subscribe(
                ok => {
                    if(ok == 'ok'){
                        this.result = true;
                        super.close();
                    }else{
                        this.result = false;
                        super.close();
                    }
                }
                ,error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else
                        console.log('error: '+error);
                }
            );
    }

    close() {
        this.result = false;
        super.close();
    }
}