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

    tags: Array<Tag> = new Array;
    selectedTags: any[]
    filteredTagsMultiple: any[];

    constructor(
        dialogService: DialogService,
        private router: Router,
        private ideaService: IdeaService
    ) {
        super(dialogService);
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {
      
    }

   crearIdea() {
        let temp: Array<Idea> = new Array;
        this.idea.alcance = this.alcance;
        this.idea.tipo = this.selectedValueTipo;
        this.idea.contenido = this.contenido;
        this.idea.numeroEstudiantes = this.numeroEstudiantes;
        this.idea.problematica = this.problematica;
        this.idea.tags = this.selectedTags;
        console.log(this.selectedTags);
        console.log(this.idea);
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
    
    close(){
        super.close();
    }
    

    
}