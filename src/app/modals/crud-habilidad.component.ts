import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HabilidadService } from '../services/habilidad.service';
import { CarreraService } from '../services/carrera.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Habilidad } from '../entities/habilidad';
import { Carrera } from '../entities/carrera';

export interface RequestModalDisplay {
    habilidad: Habilidad;
    tipo: string;
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" (click)="close()">&times;</button>
                    <h4 class="modal-title">Editar Habilidad</h4>
                </div>
                <div class="modal-body">
                    <form novalidate class="form-horizontal" (ngSubmit)="save()" [formGroup]="update">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Nombre</label>
                            <div class="col-sm-10">
                                <input [(ngModel)]="nombre" class="form-control" type="text" formControlName="nombre"> 
                                <div class="alert alert-danger" *ngIf="update.get('nombre').touched && update.get('nombre').hasError('required')">
                                    Nombre es requerido.
                                </div>
                            </div>
                        </div>
                      <div *ngIf="tipo == 'create'" class="form-group">
                            <label class="col-sm-2 control-label">Tipo</label>
                            <div class="col-sm-10">
                                <select [(ngModel)]="tipoHabilidad" class="form-control" name="tipoHabilidad" [ngModelOptions]="{standalone: true}">
                                    <option value="PERSONALES">PERSONALES</option>
                                    <option values="PROFESIONALES">PROFESIONALES</option>
                                </select>
                            </div>
                        </div>
                        <div *ngIf="tipo == 'create' && tipoHabilidad=='PROFESIONALES'" class="form-group">
                            <label class="col-sm-2 control-label">Carrera</label>
                            <div class="col-sm-10">
                                <select [(ngModel)]="carreraSelected" class="form-control" name="carreras" [ngModelOptions]="{standalone: true}">
                                     <option *ngFor="let x of carreras" [ngValue]="x" >{{x.nombre}}</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" [disabled]="update.invalid" >Guardar</button>
                    </form><br>
                    <button *ngIf="tipo == 'update'" type="submit" class="btn btn-danger btn-block" (click)="delete()">Eliminar</button>
                </div>
            </div>
        </div>`,
    styleUrls: ['../access/signup.component.css', './edit-carrera.component.css']
})
export class CrudHabilidadModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    habilidad: Habilidad;
    tipo: string;
    nombre: string;
    carreraSelected: Carrera;
    carreras: Carrera[] = [];
    tipoHabilidad: string;


    update: FormGroup;

    constructor(
        dialogService: DialogService,
        private habilidadService: HabilidadService,
        private carreraService: CarreraService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        if(this.tipo=="create"){
            this.refreshCarrera();
        }    
        this.nombre = this.habilidad.nombre;
        this.update = this.fb.group({
            nombre: ['', Validators.required]
            //tipoHabilidad: ['', [Validators.required, Validators.pattern('[a-zA-Z]+]')]]
        });

        this.tipoHabilidad = "PERSONALES";
       
    }


    save() {
        let habilidad: Habilidad = new Habilidad();
        habilidad.nombre = this.nombre;
        habilidad.id = this.habilidad.id;
        habilidad.carrera = this.habilidad.carrera;
        habilidad.tipo = this.habilidad.tipo;
        if (this.tipo == "update") {
            this.habilidadService.actualizar(habilidad)
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
                }
                );
        }
        if (this.tipo == "create") {
            let habilidad = new Habilidad();
            habilidad.id = this.habilidad.id;
            habilidad.nombre = this.nombre;
            habilidad.carrera = this.habilidad.carrera;
            habilidad.tipo = this.tipoHabilidad;
            if(this.tipoHabilidad=="PROFESIONALES")
                habilidad.idCarrera = this.carreraSelected.id;
            else
                habilidad.idCarrera = "";
            this.habilidadService.crear(habilidad)
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
                }
                );
        }
    }

    delete() {
        let habilidad: Habilidad = new Habilidad();
        habilidad.nombre = this.nombre;
        habilidad.carrera = this.habilidad.carrera;
        habilidad.tipo = this.habilidad.tipo;
        habilidad.id = this.habilidad.id;
        if (this.tipo == "update") {
            this.habilidadService.eliminar(habilidad)
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
                }
                );
        }
    }

    close() {
        this.result = false;
        super.close();
    }

      refreshCarrera() {
        this.carreraService.getAllCarreras()
            .subscribe(
            carreras => {this.carreras = carreras,
                 this.carreraSelected = this.carreras[0];
            },           
            error => console.log("Error cargando las carreras " + error)
            );
    }
        
}