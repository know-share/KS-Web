import { AsociarTGModalComponent } from './asociarTG.component';
import { TrabajoGrado } from './../entities/trabajoGrado';
import { IdeasProyectoModalComponent } from './ideasProyecto.component';
import { TagService } from './../services/tag.service';
import { Tag } from './../entities/tag';
import { Idea } from './../entities/idea';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { IdeaService } from '../services/idea.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

export interface RequestModalDisplay {
    idea : Idea;
}

@Component({
    selector: 'confirm',
    templateUrl: './crear-idea.html',
})
export class CrearIdeaModalComponent extends DialogComponent<null, Idea>
    implements  OnInit {    

    idea: Idea = new Idea();
    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;
    valid : boolean = true;
    tags: Array<Tag> = new Array;
    selectedTags: any[] = new Array;
    filteredTagsMultiple: any[];
    role = localStorage.getItem('role');
    ideasPro: Array<Idea>;
    tg: TrabajoGrado;

    constructor(
        dialogService: DialogService,
        private router: Router,
        private ideaService: IdeaService,
        private tagService: TagService
    ) {
        super(dialogService);
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {
      
    }

   crearIdea() {
        if(this.contenido != undefined && this.selectedValueTipo == "NU" && this.selectedTags.length > 0){
            this.crearIdeaNorm();
        }else{
            this.valid = false;
        }
        if(this.contenido != undefined && this.selectedValueTipo == "PC" && this.selectedTags.length > 0 && 
            this.numeroEstudiantes > 0){
            this.crearIdeaNorm();
        }else{
            this.valid = false;
        }
        if(this.contenido != undefined && this.selectedValueTipo == "PE" && this.selectedTags.length > 0 && 
            this.numeroEstudiantes > 0 && this.alcance!=undefined && this.problematica != undefined){
            this.crearIdeaNorm();
        }else{
            this.valid = false;
        }
        if(this.contenido != undefined && this.selectedValueTipo == "PR" && this.selectedTags.length > 0 && 
            this.ideasPro.length > 0){
            this.crearIdeaNorm();
        }else{
            this.valid = false;
        } 
    }

    crearIdeaNorm(){
        let temp: Array<Idea> = new Array;
        this.idea.alcance = this.alcance;
        this.idea.tipo = this.selectedValueTipo;
        this.idea.contenido = this.contenido;
        this.idea.numeroEstudiantes = this.numeroEstudiantes;
        this.idea.problematica = this.problematica;
        this.idea.tags = this.selectedTags;
        this.idea.ideasProyecto = this.ideasPro;
        this.ideaService.crearIdea(this.idea)
                .subscribe((res: Idea) => {
                    this.result = res;
                    super.close();
                }, error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                });
    }
    
    
    showTags() {
        this.tagService.getAllTags()
            .subscribe((res: Array<Tag>) => {
                this.tags = res;
            }, error => {
                console.log("Error" + error);
            });
    }

    filterTagMultiple(event) {
        let query = event.query;
        this.tagService.getAllTags().subscribe((tags: Array<Tag>) => {
            this.filteredTagsMultiple = this.filterTag(query, tags);
        });
    }

    filterTag(query, tags: any[]): any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if (tag.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(tag);
            }
        }
        return filtered;
    }

    agregarIdeas(){
        let disposable = this.dialogService.addDialog(IdeasProyectoModalComponent,{})
        .subscribe(confirmed => {
                if (confirmed) {
                    this.ideasPro = confirmed;
                    console.log(this.ideasPro.length);
                } else {
                }
            });
    }

    asociarTG(){
        let disposable = this.dialogService.addDialog(AsociarTGModalComponent,{})
        .subscribe(confirmed => {
                if (confirmed) {
                    this.tg = confirmed;
                    
                } else {
                }
            });
    }

    close(){
        super.close();
    }
    

    
}