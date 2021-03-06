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
    isMain: boolean;
    isNew: boolean;
}

@Component({
    selector: 'confirm',
    templateUrl: './edit-carrera.component.html',
    styleUrls: ['../access/signup.component.css', './edit-carrera.component.css']
})
/**
 * Modal que se encarga de editar las carreras dle usuario.
 */
export class EditCarreraModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    usuario: Usuario;
    isMain: boolean;
    isNew: boolean;

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
    copyEnfasisCarrera: Enfasis[] = [];
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
                if (!this.isNew){
                    if (this.isMain){
                        if(this.usuario.segundaCarrera)
                            this.carreras = this.carreras.filter(c => c.id != this.usuario.segundaCarrera.id);
                        this.carrera = this.carreras.find(c => c.nombre == this.usuario.carrera.nombre);
                    }else{
                        this.carreras = this.carreras.filter(c => c.id != this.usuario.carrera.id);
                        this.carrera = this.carreras.find(c => c.nombre == this.usuario.segundaCarrera.nombre);
                    }
                }else{
                    this.carreras = this.carreras.filter(c => c.id != this.usuario.carrera.id);
                    this.carrera = this.carreras[0];
                }
                this.loading = false;
                this.getEnfasis();
                this.getHabilidades();
            }, error => this.loading = false
            );
    }

    /**
     * Carga la informacion actual del usuario.
     */
    loadPersistentInfo() {
        this.habilidadesOriginales = [];
        this.areasConocimientoOtraCarrera = [];
        let carreraActual;
        if (!this.isNew) {
            if (this.isMain)
                carreraActual = this.usuario.carrera.nombre;
            else
                carreraActual = this.usuario.segundaCarrera.nombre;
        }
        for (let h of this.usuario.habilidades) {
            if (this.isNew || h.tipo == 'PERSONALES' || h.carrera != carreraActual)
                this.habilidadesOriginales.push(h);
        }
        for (let ac of this.usuario.areasConocimiento) {
            if (this.isNew || ac.carrera != carreraActual)
                this.areasConocimientoOtraCarrera.push(ac);
        }
    }

    /**
     * Verifica si un elemento esta en una lista
     * @param item item a buscar
     * @param list lista a donde se busca el item.
     */
    isCheckWithId(item, list) {
        return this.isCheck(item,list);
    }

    /**
     * Busca un elemento en una lista
     * @param item elemento a buscar
     * @param list lista donde se busca el elemento
     */
    isCheck(item, list) {
        return list.find(obj => obj.nombre == item.nombre) == null ? false : true;
    }

    /**
     * Verifica si una habilidad esta en la lista y si no la agrega
     * @param h habilidad a verificar
     */
    checkHabilidades(h) {
        if (this.habilidadesSelected.find(obj => obj.nombre == h.nombre) == null)
            this.habilidadesSelected.push(h);
        else
            this.habilidadesSelected = this.habilidadesSelected.filter(obj => obj.nombre != h.nombre);
    }

    /**
     * Verifica si una are de conocimiento esta en la lista y si no la agrega
     * @param ac area de conocimiento a verificar
     */
    checkAC(ac) {
        if (this.acSelected.find(obj => obj.nombre == ac.nombre) == null)
            this.acSelected.push(ac);
        else
            this.acSelected = this.acSelected.filter(obj => obj.nombre != ac.nombre);
    }

    /**
     * Carga los enfasis y las habilidades al momento de 
     * cambiar una carrera
     */
    onChangeCarrera() {
        this.getEnfasis();
        this.getHabilidades();
    }

    /**
     * Trae los enfasis de una carrera determinada.
     */
    getEnfasis() {
        this.enfasisCarrera = [];
        this.acSelected = [];
        this.areasConocimiento = [];
        this.loading = true;
        this.carreraService.getEnfasisAreaConocimiento(this.carrera.id)
            .subscribe(
            enfasisAC => {
                for (let e of enfasisAC.enfasis) {
                    let enf: Enfasis = new Enfasis();
                    enf.carrera = this.carrera.id;
                    enf.nombre = e;
                    this.enfasisCarrera.push(enf);
                }
                if (!this.isNew) {
                    if (this.isMain) {
                        this.enfasisPrincipal = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[0].nombre);
                        if (this.usuario.enfasis[1])
                            this.enfasisSecundario = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[1].nombre);
                        else
                            this.enfasisSecundario = null;
                        if (!this.enfasisPrincipal)
                            this.enfasisPrincipal = this.enfasisCarrera[0];
                        if (!this.enfasisSecundario)
                            this.enfasisSecundario = null;
                    } else {
                        this.enfasisPrincipal = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[2].nombre);
                        if (this.usuario.enfasis[3])
                            this.enfasisSecundario = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[3].nombre);
                        else
                            this.enfasisSecundario = null;
                        if (!this.enfasisPrincipal)
                            this.enfasisPrincipal = this.enfasisCarrera[0];
                        if (!this.enfasisSecundario)
                            this.enfasisSecundario = null;
                    }
                } else {
                    this.enfasisPrincipal = this.enfasisCarrera[0];
                    this.enfasisSecundario = null;
                }
                this.copyEnfasisCarrera = this.enfasisCarrera.filter(e=>e.nombre != this.enfasisPrincipal.nombre);

                //--------------------------------------------------------
                for (let ac of enfasisAC.areaConocimiento) {
                    let acNew: AreaConocimiento = new AreaConocimiento();
                    acNew.carrera = this.carrera.id;
                    acNew.nombre = ac;
                    acNew.porcentaje = 0;
                    if (!this.isNew) {
                        let acUsuario = this.usuario.areasConocimiento.find(a => a.nombre == ac);
                        if (acUsuario) {
                            acNew.porcentaje = acUsuario.porcentaje;
                            this.acSelected.push(acUsuario);
                        }
                    }

                    this.areasConocimiento.push(acNew);
                }
                this.loading = false;
            },
            error => this.loading = false
            )
    }

    /**
     * Trae las habilidades de una carrera determinada.
     */
    getHabilidades() {
        this.loading = true;
        this.habilidadesSelected = [];
        this.habilidadService.getHabilidadesProfesionales(this.carrera.id)
            .subscribe(
            habilidades => {
                this.habilidadesProfesionales = habilidades;
                for (let h of this.habilidadesProfesionales) {
                    let existente = this.usuario.habilidades.find(hp => hp.nombre == h.nombre);
                    if (!this.isNew && existente) {
                        this.habilidadesSelected.push(existente);
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
        if (this.isMain) {
            dto.carrera = this.carrera;
            dto.segundaCarrera = this.usuario.segundaCarrera;
        } else {
            dto.carrera = this.usuario.carrera;
            dto.segundaCarrera = this.carrera;
        }

        dto.enfasis = this.usuario.enfasis;
        if (this.isMain) {
            dto.enfasis[0] = this.enfasisPrincipal;
            dto.enfasis[1] = this.enfasisSecundario;
        } else {
            if (!this.isNew) {
                dto.enfasis[2] = this.enfasisPrincipal;
                dto.enfasis[3] = this.enfasisSecundario;
            } else {
                dto.enfasis.push(this.enfasisPrincipal);
                dto.enfasis.push(this.enfasisSecundario);
            }
        }
        dto.areasConocimiento = this.areasConocimientoOtraCarrera.concat(this.acSelected);
        dto.habilidades = this.habilidadesOriginales.concat(this.habilidadesSelected);
        this.usuarioService.actualizarInfoAcademica(dto)
            .subscribe(
            ok => {
                if (ok == 'ok') {
                    this.result = true;
                    super.close();
                } else {
                    this.result = false;
                    super.close();
                }
            }
            , error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    console.log('error: ' + error);
                super.close();
            });
    }

    /**
     * Cierra el modal sin confirmar los cambios
     */
    close() {
        this.result = false;
        super.close();
    }

    /**
     * Hace una copia de los enfasis.
     * @param event 
     */
    updateCopyEnfasis(event){
        if(this.enfasisSecundario && this.enfasisPrincipal.nombre == this.enfasisSecundario.nombre)
            this.enfasisSecundario = null;
        this.copyEnfasisCarrera = this.enfasisCarrera.filter(e=>e.nombre != this.enfasisPrincipal.nombre);
    }
}