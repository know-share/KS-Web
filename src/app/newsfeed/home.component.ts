import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from "ng2-bootstrap-modal";
import {AutoCompleteModule} from 'primeng/primeng';

import { RequestModalComponent } from '../modals/request.component';
import { ExpirationModalComponent } from '../modals/expiration.component';

import { IdeaService } from '../services/idea.service';
import { UsuarioService } from '../services/usuario.service';
import { TagService } from '../services/tag.service';

import { Idea } from '../entities/idea';
import { Tag } from '../entities/tag';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    //styleUrls: ['']
})
export class HomeComponent implements OnInit {

    ideaForm: FormGroup;
    newIdeas : Array<Idea> = new Array;
    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;

    listSolicitudes: string[] = [];
    cantidadSolicitudes: number = 0;

    
    tags : Array<Tag> = new Array;
    selectedTags : any[]
    filteredTagsMultiple: any[];

    constructor(
        private fb: FormBuilder,
        private ideaService: IdeaService,
        private usuarioService: UsuarioService,
        private dialogService: DialogService,
        private tagService : TagService
    ) {
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {

        this.listSolicitudes = [];
        this.cantidadSolicitudes = 0;
        
        this.refreshSolicitudes();
        this.showTags();
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

    operacion(ide:Idea){
        console.log(ide.contenido);
    }

    crearIdea() {
        let idea: Idea = new Idea();
        idea.alcance = this.alcance;
        idea.tipo = this.selectedValueTipo;
        idea.contenido = this.contenido;
        idea.numeroEstudiantes = this.numeroEstudiantes;
        idea.problematica = this.problematica;
        idea.tags = this.selectedTags;
        console.log(this.selectedTags);
        console.log(idea);
        this.ideaService.crearIdea(idea)
            .subscribe((res:Idea) => {
                this.newIdeas.push(res);
                console.log(res.usuario);
            }, error => {
                let disposable;
                if(error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });

        this.selectedTags = new Array;
        this.contenido = '';
        this.alcance = '';
        this.problematica = '';
        this.numeroEstudiantes = 0;
    }

    showRequests() {
        let disposable = this.dialogService.addDialog(RequestModalComponent, {
            listSolicitudes: this.listSolicitudes
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshSolicitudes();
                }
            });
    }

    showTags(){
        this.tagService.getAllTags()
            .subscribe((res : Array<Tag>)=>{
                this.tags = res;
            },error => {
                console.log("Error" + error)
            });
    }

    filterTagMultiple(event) {
        let query = event.query;
        this.tagService.getAllTags().subscribe((tags:Array<Tag>) => {
            this.filteredTagsMultiple = this.filterTag(query, tags);
        });
    }

    filterTag(query, tags: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if(tag.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(tag);
            }
        }
        return filtered;
    }
}