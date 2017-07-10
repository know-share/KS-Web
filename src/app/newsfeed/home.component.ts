import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from "ng2-bootstrap-modal";

import { RequestModalComponent } from '../modals/request.component';
import { ExpirationModalComponent } from '../modals/expiration.component';

import { IdeaService } from '../services/idea.service';
import { UsuarioService } from '../services/usuario.service';

import { Idea } from '../entities/idea';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    //styleUrls: ['']
})
export class HomeComponent implements OnInit {

    ideaForm: FormGroup;

    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;

    listSolicitudes: string[] = [];
    cantidadSolicitudes: number = 0;

    constructor(
        private fb: FormBuilder,
        private ideaService: IdeaService,
        private usuarioService: UsuarioService,
        private dialogService: DialogService,
    ) {
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {
        this.ideaForm = this.fb.group({
            /*contenidoControl : ['', Validators.required],
            numeroEstudiantesControl : ['',Validators.required],
            alcanceControl : ['',Validators.required],
            problematicaControl : ['',Validators.required]*/
        });

        this.listSolicitudes = [];
        this.cantidadSolicitudes = 0;

        this.refreshSolicitudes();
    }

    refreshSolicitudes() {
        this.usuarioService.getUsuario(localStorage.getItem('user'))
            .subscribe(
            res => {
                localStorage.setItem("dto", JSON.stringify(res));
                this.listSolicitudes = res.solicitudesAmistad;
                this.cantidadSolicitudes = this.listSolicitudes.length;
            },error =>{
                let disposable;
                if(error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    console.log('Error '+error);
            }
        );
    }

    crearIdea() {
        let idea: Idea = new Idea();
        idea.alcance = this.alcance;
        idea.tipo = this.selectedValueTipo;
        idea.contenido = this.contenido;
        idea.numeroEstudiantes = this.numeroEstudiantes;
        idea.problematica = this.problematica;
        console.log(idea);
        this.ideaService.crearIdea(idea)
            .subscribe(res => {
                //punlicarla y decilre exito
            }, error => {
                let disposable;
                if(error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    showRequests() {
        let disposable = this.dialogService.addDialog(RequestModalComponent, {
            listSolicitudes: this.listSolicitudes
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshSolicitudes();
                }
            },error=>{
                let disposable;
                if(error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            }
            );
    }
}