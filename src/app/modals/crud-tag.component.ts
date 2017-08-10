import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TagService } from '../services/tag.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Tag } from '../entities/tag';

export interface RequestModalDisplay {
    tag: Tag;
    tipo: string;
    antiguo:string;
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" (click)="close()">&times;</button>
                    <h4 class="modal-title">Editar Tag</h4>
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
                        <button type="submit" class="btn btn-primary btn-block" [disabled]="update.invalid" >Guardar</button>
                    </form><br>
                    <button *ngIf="tipo == 'update'" type="submit" class="btn btn-danger btn-block" (click)="delete()">Eliminar</button>
                </div>
            </div>
        </div>`,
    styleUrls: ['../access/signup.component.css', './edit-carrera.component.css']
})
export class CrudTagModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    tag: Tag;
    tipo: string;
    antiguo: string;
    nombre:string;

    update: FormGroup;

    constructor(
        dialogService: DialogService,
        private tagService: TagService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.nombre = this.tag.nombre;
        this.update = this.fb.group({
            nombre: ['', Validators.required]
        });
    }


    save() {
        let tag: Tag = new Tag();
        tag.nombre = this.nombre;
        tag.id = this.antiguo;
        if (this.tipo == "update") {
            this.tagService.actualizar(tag)
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
            let tag = new Tag();
            tag.nombre = this.nombre;
            this.tagService.crear(tag)
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
        let tag: Tag = new Tag();
        tag.nombre = this.nombre;
        tag.id = this.antiguo;
        if (this.tipo == "update") {
            this.tagService.eliminar(tag)
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