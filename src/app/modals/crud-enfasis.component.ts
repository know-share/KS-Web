import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CarreraService } from '../services/carrera.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Carrera } from '../entities/carrera';
import { Enfasis } from '../entities/enfasis';

export interface RequestModalDisplay {
    carreras: Carrera[];
    enfasis:Enfasis;
    tipo: string;
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" (click)="close()">&times;</button>
                    <h4 class="modal-title">Editar Énfasis</h4>
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
export class CrudEnfasisModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    tipo: string;
    nombre: string;
    enfasis:Enfasis;
    update: FormGroup;
    carreras: Carrera[];
    carreraSelected: Carrera;

    constructor(
        dialogService: DialogService,
        private carreraService: CarreraService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.nombre = this.enfasis.nombre;
        this.update = this.fb.group({
            nombre: ['', Validators.required]
        });
        this.carreraSelected = this.carreras[0];
    }


    save() {
        if (this.tipo == "update") {
            let lista: string[]=[];
            let carrera;
            for(let cr of this.carreras){
                if(cr.nombre == this.enfasis.carrera){
                    carrera = cr;
                    for(let en of cr.enfasis){
                       if(this.enfasis.nombre==en)
                            lista.push(this.nombre);
                       else
                            lista.push(en);
                    }    
                }
            }
            carrera.enfasis = lista;
            this.carreraService.actualizar(carrera)
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
            if(this.carreraSelected.enfasis==null){
                this.carreraSelected.enfasis = [];
                this.carreraSelected.enfasis.push(this.nombre);
            }
            else
                this.carreraSelected.enfasis.push(this.nombre);
           
            this.carreraService.actualizar(this.carreraSelected)
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
  if (this.tipo == "update") {
            let lista: string[]=[];
            let carrera;
            for(let cr of this.carreras){
                if(cr.nombre == this.enfasis.carrera){
                    carrera = cr;
                    for(let en of cr.enfasis){
                       if(this.enfasis.nombre!=en)
                           lista.push(en);
                    }    
                }
            }
            carrera.enfasis = lista;
            this.carreraService.actualizar(carrera)
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
}