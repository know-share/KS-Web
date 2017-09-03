import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CarreraService } from '../services/carrera.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Carrera } from '../entities/carrera';

import { Message } from 'primeng/primeng';

export interface RequestModalDisplay {
    carrera: Carrera;
    tipo: string;
}

@Component({
    selector: 'confirm',
    template: `
    <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" (click)="close()">&times;</button>
                    <h4 class="modal-title">Editar Carrera</h4>
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
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Facultad</label>
                            <div class="col-sm-10">
                                <input [(ngModel)]="facultad" class="form-control" type="text" formControlName="facultad">
                                <div class="alert alert-danger" *ngIf="update.get('facultad').touched && update.get('facultad').hasError('required')">
                                    Facultad es requerido.
                                </div>
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
export class CrudCarreraModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    carrera: Carrera;
    tipo: string;
    nombre: string;
    facultad: string;
    msgs: Message[] = [];
    update: FormGroup;

    constructor(
        dialogService: DialogService,
        private carreraService: CarreraService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.nombre = this.carrera.nombre;
        this.facultad = this.carrera.facultad;
        this.update = this.fb.group({
            nombre: ['', Validators.required],
            facultad: ['', Validators.required]
        });
    }


    save() {
        let carrera: Carrera = new Carrera();
        carrera.nombre = this.nombre;
        carrera.facultad = this.facultad;
        carrera.id = this.carrera.id;
        if (this.tipo == "update") {
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
                    super.close();
                }
                );
        }
        if (this.tipo == "create") {
            let carrera = new Carrera();
            carrera.id = this.nombre;
            carrera.nombre = this.nombre;
            carrera.facultad = this.facultad;
            this.carreraService.crear(carrera)
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
                    super.close();
                }
                );
        }
    }

    delete() {
        let carrera: Carrera = new Carrera();
        carrera.nombre = this.nombre;
        carrera.facultad = this.facultad;
        carrera.id = this.carrera.id;
        if (this.tipo == "update") {
            this.carreraService.eliminar(carrera)
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