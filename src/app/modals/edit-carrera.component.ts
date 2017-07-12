import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';
import { CarreraService } from '../services/carrera.service';

import { Carrera } from '../entities/carrera';
import { Usuario } from '../entities/usuario';
import { EnfasisAC } from '../entities/enfasisAC';
import { Enfasis } from '../entities/enfasis';
import { AreaConocimiento } from '../entities/areaConocimiento';

export interface RequestModalDisplay {
    usuario: Usuario;
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                     <h4 class="modal-title">Editar Carrera</h4>
                   </div>
                   <div class="modal-body">
                   <div id="loading" *ngIf="loading">
                        <img src="images/loading.gif" />
                    </div>
                        <label >Carrera</label>
                        <select [(ngModel)]="carrera" (ngModelChange)="getEnfasis()" 
                            class="form-control" name="carrera">
                            <option *ngFor="let c of carreras" [ngValue]="c" >{{c.nombre}}</option>
                        </select>
                        <label >Enfasis principal</label>
                        <select [(ngModel)]="enfasisPrincipal" 
                            class="form-control" name="carrera">
                            <option *ngFor="let e of enfasisCarrera" [ngValue]="e" >{{e.nombre}}</option>
                        </select>
                        <label >Enfasis secundario</label>
                        <select [(ngModel)]="enfasisSecundario" 
                            class="form-control" name="carrera">
                            <option value=null>Ninguna</option>
                            <option *ngFor="let e of enfasisCarrera" [ngValue]="e" >{{e.nombre}}</option>
                        </select>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-primary" (click)="confirm()">Guardar</button>
                     <button type="button" class="btn btn-default" (click)="close()" >Cancelar</button>
                   </div>
                 </div>
              </div>`,
    styleUrls: ['../user/user.component.css']
})
export class EditCarreraModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    usuario: Usuario;

    loading: boolean = false;

    carrera: Carrera;
    enfasisPrincipal: Enfasis;
    enfasisSecundario: Enfasis;

    carreras: Carrera[] = [];
    enfasisCarrera: Enfasis[] = [];

    constructor(
        dialogService: DialogService,
        private router: Router,
        private usuarioService: UsuarioService,
        private carreraService: CarreraService,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.loading = true;
        this.carreraService.getAllCarreras()
            .subscribe(
            carreras => {
                this.carreras = carreras;
                this.carrera = this.carreras.find(c => c.nombre == this.usuario.carrera.nombre);
                this.loading = false;
                this.getEnfasis();
            }, error => this.loading = false
            );
    }

    getEnfasis() {
        this.loading = true;
        this.carreraService.getEnfasisAreaConocimiento(this.carrera.nombre)
            .subscribe(
            enfasisAC => {
                this.enfasisCarrera = [];
                for (let e of enfasisAC.enfasis) {
                    let enf: Enfasis = new Enfasis();
                    enf.carrera = this.carrera.nombre;
                    enf.nombre = e;
                    this.enfasisCarrera.push(enf);
                }
                this.enfasisPrincipal = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[0].nombre);
                if(this.usuario.enfasis[1])
                    this.enfasisSecundario = this.enfasisCarrera.find(e => e.nombre == this.usuario.enfasis[1].nombre);
                else
                    this.enfasisSecundario = this.usuario.enfasis[1];
                if(!this.enfasisPrincipal)
                    this.enfasisPrincipal = this.enfasisCarrera[0];
                this.loading = false;
            },
            error => this.loading = false
            )
    }

    confirm(){
        this.result = true;
        super.close();
    }

    close() {
        this.result = false;
        super.close();
    }
}