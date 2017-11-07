import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';
import { CualidadService } from '../services/cualidad.service';
import { HabilidadService } from '../services/habilidad.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Usuario } from '../entities/usuario';
import { Habilidad } from '../entities/habilidad';
import { Cualidad } from '../entities/cualidad';

export interface RequestModalDisplay {
    usuario: Usuario;
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" (click)="close()">&times;</button>
                <h4 *ngIf="usuario.tipoUsuario != 'PROFESOR'" class="modal-title">Editar Habilidades personales</h4>
                <h4 *ngIf="usuario.tipoUsuario == 'PROFESOR'" class="modal-title">Editar Cualidades como profesor</h4>
            </div>
            <div *ngIf="usuario.tipoUsuario != 'PROFESOR'" class="modal-body">
                <div id="loading" *ngIf="loading">
                    <img src="images/loading.gif" />
                </div>
                <div class="row">
                    <div *ngFor="let h of habilidades" class="col-sm-4">
                        <div [ngClass]="isCheckWithId(h,habilidadesSelected) ? 'thumbnail check':'thumbnail'" (click)="checkHabilidades(h)">{{h.nombre}}</div>
                    </div>
                </div>
            </div>
            <div *ngIf="usuario.tipoUsuario == 'PROFESOR'" class="modal-body">
                <div id="loading" *ngIf="loading">
                    <img src="images/loading.gif" />
                </div>
                <div class="row">
                    <div *ngFor="let c of cualidades" class="col-sm-4">
                        <div [ngClass]="isCheckWithId(c,cualidadesSelected) ? 'thumbnail check':'thumbnail'" (click)="checkCualidades(c)">{{c.nombre}}</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" (click)="confirm()">Guardar</button>
                <button type="button" class="btn btn-default" (click)="close()">Cancelar</button>
            </div>
        </div>
    </div>`,
    styleUrls: ['../access/signup.component.css', './edit-carrera.component.css']
})
/**
 * Modal que permite editar las habilidades de un usuario
 */
export class EditHabilidadModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    usuario: Usuario;
    loading: boolean = false;

    habilidades: Habilidad[] = [];
    cualidades: Cualidad[] = [];

    habilidadesProfesionales: Habilidad[] = [];

    habilidadesSelected: Habilidad[] = [];
    cualidadesSelected: Cualidad[] = [];

    constructor(
        dialogService: DialogService,
        private habilidadService: HabilidadService,
        private cualidadService: CualidadService,
        private usuarioService: UsuarioService,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.habilidades = [];
        this.cualidades = [];

        this.habilidadesProfesionales = [];
        this.loading = true;
        this.habilidadesSelected = [];
        this.cualidadesSelected = [];
        this.loadInitInfo();
        if (this.usuario.tipoUsuario != 'PROFESOR') {
            this.habilidadService.getHabilidades(this.usuario.carrera.nombre)
                .subscribe(
                habilidades => {
                    for (let h of habilidades) {
                        if (h.tipo == 'PERSONALES') {
                            this.habilidades.push(h);
                            let existente = this.usuario.habilidades.find(hp => hp.nombre == h.nombre);
                            if (existente) {
                                this.habilidadesSelected.push(existente);
                            }
                        }
                    }
                    this.loading = false
                }, error => this.loading = false
                );
        } else {
            this.cualidadService.getAllCualidades()
                .subscribe(
                cualidades => {
                    this.cualidades = cualidades;
                    for (let c of this.cualidades) {
                        let existente = this.usuario.cualidades.find(cu => cu.nombre == c.nombre);
                        if (existente)
                            this.cualidadesSelected.push(existente);
                    }
                    this.loading = false
                }, error => this.loading = false
                );
        }
    }

    /**
     * Agrega a una lista las habilidades profesionales de un usuario
     */
    loadInitInfo() {
        for (let h of this.usuario.habilidades) {
            if (h.tipo == 'PROFESIONALES')
                this.habilidadesProfesionales.push(h);
        }
    }

    /**
     * Verifica si un item esta en una lista
     * @param item item a buscar
     * @param list lista donde se buscara el item
     */
    isCheckWithId(item, list) {
        return list.find(obj => obj.nombre == item.nombre) == null ? false : true;
    }

    /**
     * Verifica si una habilidad ya esta checkeada
     * @param h habilidad a consultar
     */
    checkHabilidades(h) {
        if (this.habilidadesSelected.find(obj => obj.nombre == h.nombre) == null)
            this.habilidadesSelected.push(h);
        else
            this.habilidadesSelected = this.habilidadesSelected.filter(obj => obj.nombre != h.nombre);
    }

    /**
     * Verifica si una cualidad ya esta checkeada
     * @param c cualidad a consultar
     */
    checkCualidades(c) {
        if (this.cualidadesSelected.find(obj => obj.nombre == c.nombre) == null)
            this.cualidadesSelected.push(c);
        else
            this.cualidadesSelected = this.cualidadesSelected.filter(obj => obj.nombre != c.nombre);
    }

    /**
     * Confirma los cambios que se hizo el usuario
     */
    confirm() {
        let usu: Usuario = new Usuario();
        usu.id = this.usuario.id;
        usu.tipoUsuario = this.usuario.tipoUsuario;
        if (this.usuario.tipoUsuario == 'PROFESOR') {
            usu.cualidades = this.cualidadesSelected;
        } else {
            usu.habilidades = this.habilidadesProfesionales
                .concat(this.habilidadesSelected);
        }
        this.usuarioService.actualizarHabilidadCualidad(usu)
            .subscribe(
            ok => {
                if (ok == 'ok') {
                    this.result = true;
                    super.close();
                } else {
                    this.result = false;
                    super.close();
                }
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    console.log('error: ' + error);
            });
    }

    /**
     * Cierra el modal sin confirmar los cambios
     */
    close() {
        this.result = false;
        super.close();
    }
}