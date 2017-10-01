import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../services/usuario.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Usuario } from '../entities/usuario';

export interface RequestModalDisplay {
    usuario: Usuario;
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" (click)="close()">&times;</button>
                    <h4 class="modal-title">Editar Información personal</h4>
                </div>
                <div class="modal-body">
                    <form novalidate class="form-horizontal" (ngSubmit)="confirm()" [formGroup]="update">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Nombre</label>
                            <div class="col-sm-10">
                                <input [(ngModel)]="nombre" class="form-control" type="text" formControlName="name">
                                <div class="alert alert-danger" *ngIf="update.get('name').touched && update.get('name').hasError('required')">
                                    Nombre es requerido.
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Apellido</label>
                            <div class="col-sm-10">
                                <input [(ngModel)]="apellido" class="form-control" type="text" formControlName="lastName">
                                <div class="alert alert-danger" *ngIf="update.get('lastName').touched && update.get('lastName').hasError('required')">
                                    Apellido es requerido.
                                </div>
                            </div>
                        </div>
                        <div *ngIf="usuario.tipoUsuario=='PROFESOR'" class="form-group">
                            <label class="col-sm-2 control-label">Grupo de investigación</label>
                            <div class="col-sm-10">
                                <input placeholder="Opcional" [(ngModel)]="grupo" class="form-control" type="text" [ngModelOptions]="{standalone: true}">
                            </div>
                        </div>
                        <div *ngIf="usuario.tipoUsuario=='PROFESOR'" class="form-group">
                            <label class="control-label col-sm-2">Disponible semestre actual</label>
                            <div class="col-sm-10">
                                <select [(ngModel)]="disponible" class="form-control" name="disponible" [ngModelOptions]="{standalone: true}">
                                    <option [ngValue]=true>Si</option>
                                    <option [ngValue]=false>No</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Correo Electrónico</label>
                            <div class="col-sm-10">
                                <input [(ngModel)]="correo" class="form-control" type="text" formControlName="email">
                                <div class="alert alert-danger" *ngIf="update.get('email').touched && update.get('email').hasError('required')">
                                    Correo Electrónico es requerido.
                                </div>
                                <div class="alert alert-danger" *ngIf="update.get('email').touched && update.get('email').hasError('pattern')">
                                    Ingrese un correo electrónico válido.
                                </div>
                                <div class="alert alert-danger" *ngIf="update.get('email').touched && update.controls.email.errors?.CorreoTaken">
                                    Correo electrónico ya registrado. Intente con otro.
                                </div>
                            </div>
                        </div>
                        <div *ngIf="usuario.tipoUsuario=='ESTUDIANTE'" class="form-group">
                            <label class="col-sm-2 control-label">Semestre</label>
                            <div class="col-sm-10">
                                <select [(ngModel)]="semestre" class="form-control" name="semestre" [ngModelOptions]="{standalone: true}">
                                    <option [ngValue]=1>1</option>
                                    <option [ngValue]=2>2</option>
                                    <option [ngValue]=3>3</option>
                                    <option [ngValue]=4>4</option>
                                    <option [ngValue]=5>5</option>
                                    <option [ngValue]=6>6</option>
                                    <option [ngValue]=7>7</option>
                                    <option [ngValue]=8>8</option>
                                    <option [ngValue]=9>9</option>
                                    <option [ngValue]=10>10</option>
                                    <option [ngValue]=11>10+</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" [disabled]="update.invalid">Guardar</button>
                    </form>
                </div>
            </div>
        </div>`,
    styleUrls: ['../access/signup.component.css', './edit-carrera.component.css']
})
export class EditBasisModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    usuario: Usuario;

    nombre: string;
    apellido: string;
    correo: string;
    semestre: number;
    grupo: string;
    disponible:boolean;

    update: FormGroup;

    constructor(
        dialogService: DialogService,
        private usuarioService: UsuarioService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.nombre = this.usuario.nombre;
        this.apellido = this.usuario.apellido;
        this.correo = this.usuario.email;
        this.grupo = this.usuario.grupoInvestigacion;
        this.semestre = this.usuario.semestre;
        this.disponible = this.usuario.disponible;
        this.update = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]+([.\-_][0-9a-zA-Z]+)*@[0-9a-zA-Z]+(\.[a-zA-Z]+)+$/i)]],
            name: ['', Validators.required],
            lastName: ['', Validators.required]
        });
    }

    confirm() {
        if (this.correo.toLowerCase() != this.usuario.email.toLowerCase()) {
            this.usuarioService.isCorreoTaken(this.correo)
                .subscribe(
                taken => {
                    if (taken)
                        this.update.get("email").setErrors({ CorreoTaken: true });
                    else {
                        this.updateUser();
                    }
                });
        }else{
            this.updateUser();
        }
    }

    updateUser() {
        let usu: Usuario = new Usuario();
        usu.id = this.usuario.id;
        usu.tipoUsuario = this.usuario.tipoUsuario;
        usu.email = this.correo;
        usu.semestre = this.semestre;
        usu.nombre = this.nombre;
        usu.disponible = this.disponible
        usu.grupoInvestigacion = this.grupo;
        usu.apellido = this.apellido;
        this.usuarioService.actualizarBasis(usu)
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
            }
            );
    }

    close() {
        this.result = false;
        super.close();
    }
}