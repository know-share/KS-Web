import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../services/usuario.service';

import { Usuario } from '../entities/usuario';
import { TrabajoGrado } from '../entities/trabajoGrado';

import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                   </div>
                   <div class="modal-body">
                        <div id="loading" *ngIf="loading">
                            <img src="images/loading.gif" />
                        </div>
                        <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="center">Registro de TG</h3>
                            <form novalidate (ngSubmit)="confirm()" [formGroup]="formGroup">
                                <div class="alert alert-danger" *ngIf="formGroup.get('titulo').touched && formGroup.get('titulo').hasError('required')
                                    || formGroup.get('resumen').touched && formGroup.get('resumen').hasError('required')">
                                    Todos los campos son requeridos.
                                </div>
                                <div class="alert alert-danger" *ngIf="formGroup.get('numEstudiantes').touched && formGroup.controls.numEstudiantes.errors?.NumMissed">
                                    El número de estudiantes ingresado es inválido.
                                </div>
                                <div class="form-group">
                                    <input placeholder="Título" [(ngModel)]="titulo" type="text" name="titulo" class="form-control" 
                                        formControlName="titulo"/>
                                </div>
                                <label>Periodo de finalización</label>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <select [(ngModel)]="anio" class="form-control" [ngModelOptions]="{standalone: true}">
                                            <option *ngFor="let a of anios" [ngValue]=a>{{a}}</option>
                                        </select>
                                    </div>
                                    <div class="col-sm-2">
                                        <select [(ngModel)]="periodo" class="form-control" [ngModelOptions]="{standalone: true}">
                                            <option [ngValue]=1>1</option>
                                            <option [ngValue]=3>3</option>
                                        </select>
                                    </div>
                                </div><br>
                                <div class="form-group">
                                    <textarea placeholder="Resumen (máx 300 caracteres)" rows="4" [(ngModel)]="resumen" name="resumen" class="form-control"
                                        formControlName="resumen"></textarea>
                                    <div class="alert alert-danger" *ngIf="formGroup.get('resumen').touched && formGroup.get('resumen').hasError('maxlength')">
                                        El límite son 300 caracteres
                                    </div>
                                </div>
                                <div *ngIf="tipoUsuario == 'PROFESOR'" class="form-group">
                                    <label for="numEstudiantes">Número de estudiantes</label>
                                    <input min=1 placeholder="Número de estudiantes" [(ngModel)]="numEstudiantes" type="number" id="numEstudiantes" name="numEstudiantes" class="form-control"
                                        formControlName="numEstudiantes"/>
                                </div>
                                <button type="submit" class="btn btn-primary btn-block" [disabled]="formGroup.invalid">Agregar</button>
                            </form>
                        </div>
                    </div>
                   </div>
                 </div>
              </div>`,
    styleUrls: ['../user/user.component.css']
})
/**
 * Modal para agregar el trabajo de grado
 * a un usuario
 */
export class AddTGModalComponent extends DialogComponent<void, boolean>
    implements OnInit{

    formGroup: FormGroup;

    //tg dirigidos
    titulo: string;
    periodo: number = 1;
    anio: string;
    resumen: string;
    numEstudiantes:number = -1;
    tipoUsuario: string;

    anios:string[] = [];

    constructor(
        dialogService: DialogService,
        private router: Router,
        private usuarioService: UsuarioService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
        this.tipoUsuario = localStorage.getItem('role');
        if(this.tipoUsuario == 'PROFESOR')
            this.numEstudiantes = 1;
    }

    ngOnInit(){
        this.anio = new Date().getFullYear().toString();
        this.periodo = 1;
        for(let i = 1980;i<=new Date().getFullYear();i++){
            this.anios.push(i.toString());
        }
        this.formGroup = this.fb.group({
            titulo:['',Validators.required],
            resumen:['',Validators.compose([Validators.required,Validators.maxLength(300)])],
            numEstudiantes:['']
        });
    }

    /**
     * Guarda el trabajo de grado asociado a
     * un usuario.
     */
    confirm(){
        if(this.tipoUsuario == 'PROFESOR' && (this.numEstudiantes == -1
            || !Number.isInteger(this.numEstudiantes) || this.numEstudiantes <= 0)){
            this.formGroup.get("numEstudiantes").setErrors({ NumMissed: true });
            return;
        }
        let tg:TrabajoGrado = new TrabajoGrado();
        tg.nombre = this.titulo;
        tg.numEstudiantes = this.numEstudiantes;
        tg.periodoFin = this.anio+"-"+this.periodo;
        tg.resumen = this.resumen;
        this.usuarioService.addTG(tg)
            .subscribe(
                ok => {
                    this.result = true;
                    super.close();
                },
                error => {
                    this.result = false;
                    let disposable;
                    if(error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else{
                        console.log('error: '+error);
                    }
                    super.close();
                }
            );
    }

    /**
     * Cierra el modal sin guardar el
     * trabajo de grado
     */
    close() {
        this.result = false;
        super.close();
    }
}