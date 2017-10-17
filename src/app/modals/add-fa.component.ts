import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../services/usuario.service';

import { Usuario } from '../entities/usuario';
import { FormacionAcademica } from '../entities/formacionAcademica';

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
                        <div class="panel-heading center">
                            <h3>Registro de Formación académica</h3>
                            <form novalidate (ngSubmit)="confirm()" [formGroup]="formGroup">
                                <div class="alert alert-danger" *ngIf="formGroup.get('titulo').touched && formGroup.get('titulo').hasError('required')
                                    || formGroup.get('anio').touched && formGroup.get('anio').hasError('required')
                                    || formGroup.get('tituloTG').touched && formGroup.get('tituloTG').hasError('required')
                                    || formGroup.get('universidad').touched && formGroup.get('universidad').hasError('required')">
                                    Todos los campos son requeridos.
                                </div>
                                <div class="form-group">
                                    <input placeholder="Título recibido" [(ngModel)]="titulo" type="text" name="titulo" class="form-control" 
                                        formControlName="titulo"/>
                                </div>
                                <div class="form-group">
                                    <input placeholder="Año de grado" [(ngModel)]="anio" min=1950 type="number" name="anio" class="form-control"
                                        formControlName="anio"/>
                                </div>
                                <div class="form-group">
                                    <input type ="text" placeholder="Título de Trabajo de grado (NA si no aplica)"[(ngModel)]="tituloTG" name="tituloTG" class="form-control"
                                        formControlName="tituloTG"/>
                                </div>
                                <div class="form-group">
                                    <input placeholder="Universidad" [(ngModel)]="universidad" type="text" name="universidad" class="form-control"
                                        formControlName="universidad"/>
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
export class AddFAModalComponent extends DialogComponent<void, boolean>
    implements OnInit{

    formGroup: FormGroup;

    //formación académica
    titulo: string;
    universidad:string;
    anio: number;
    tituloTG: string;

    constructor(
        dialogService: DialogService,
        private usuarioService: UsuarioService,
        private fb: FormBuilder,
    ) {
        super(dialogService);
    }

    ngOnInit(){
        this.formGroup = this.fb.group({
            titulo:['',Validators.required],
            universidad:['',Validators.required],
            anio:['',Validators.required],
            tituloTG:['',Validators.compose([Validators.required])]
        });
    }

    confirm(){
        let fa:FormacionAcademica = new FormacionAcademica();
        fa.titulo = this.titulo;
        fa.universidad = this.universidad;
        fa.anio = this.anio;
        fa.tituloTG = this.tituloTG;
        this.usuarioService.addFormacionAcademica(fa)
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

    close() {
        this.result = false;
        super.close();
    }
}