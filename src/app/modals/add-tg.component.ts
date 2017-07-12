import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../services/usuario.service';

import { Carrera } from '../entities/carrera';
import { Usuario } from '../entities/usuario';
import { EnfasisAC } from '../entities/enfasisAC';
import { Enfasis } from '../entities/enfasis';
import { AreaConocimiento } from '../entities/areaConocimiento';

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
                        <div class="panel-heading center">
                            <h3>Registro de TG</h3>
                            <form novalidate (ngSubmit)="confirm()" [formGroup]="formGroup">
                                <div class="alert alert-danger" *ngIf="formGroup.get('titulo').touched && formGroup.get('titulo').hasError('required')
                                    || formGroup.get('finalizacion').touched && formGroup.get('finalizacion').hasError('required')
                                    || formGroup.get('descripcion').touched && formGroup.get('descripcion').hasError('required')
                                    || formGroup.get('resumen').touched && formGroup.get('resumen').hasError('required')
                                    || formGroup.get('numEstudiantes').touched && formGroup.get('numEstudiantes').hasError('required')">
                                    Todos los campos son requeridos.
                                </div>
                                <div class="form-group">
                                    <input placeholder="Título" [(ngModel)]="titulo" type="text" name="titulo" class="form-control" 
                                        formControlName="titulo"/>
                                </div>
                                <div class="form-group">
                                    <input placeholder="Descripción" [(ngModel)]="descripcion" type="text" name="descripcion" class="form-control"
                                        formControlName="descripcion"/>
                                </div>
                                <div class="form-group">
                                    <input placeholder="Periodo de finalización (Año-Periodo: 2017-01)" [(ngModel)]="finalizacion" type="text" name="finalizacion" class="form-control"
                                        formControlName="finalizacion"/>
                                </div>
                                <div class="form-group">
                                    <textarea placeholder="Resumen (máx 300 caracteres)" rows="4" [(ngModel)]="resumen" name="resumen" class="form-control"
                                        formControlName="resumen"></textarea>
                                    <div class="alert alert-danger" *ngIf="formGroup.get('resumen').touched && formGroup.get('resumen').hasError('maxlength')">
                                        El límite son 300 caracteres
                                    </div>
                                </div>
                                <div class="form-group">
                                    <input min=1 placeholder="Número de estudiantes" [(ngModel)]="numEstudiantes" type="number" name="numEstudiantes" class="form-control"
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
export class AddTGModalComponent extends DialogComponent<void, boolean>
    implements OnInit{

    formGroup: FormGroup;

    //tg dirigidos
    titulo: string;
    descripcion:string[];
    finalizacion: string;
    resumen: string;
    numEstudiantes:number;

    constructor(
        dialogService: DialogService,
        private router: Router,
        private usuarioService: UsuarioService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
    }

    ngOnInit(){
        this.formGroup = this.fb.group({
            titulo:['',Validators.required],
            descripcion:['',Validators.required],
            finalizacion:['',Validators.required],
            resumen:['',Validators.compose([Validators.required,Validators.maxLength(300)])],
            numEstudiantes:['',Validators.compose([Validators.required])]
        });
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