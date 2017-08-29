import { IdeaService } from './../services/idea.service';
import { TagService } from './../services/tag.service';
import { Tag } from './../entities/tag';
import { Idea } from './../entities/idea';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { ExpirationModalComponent } from '../modals/expiration.component';

export interface RequestModalDisplay {
    idea : Idea;
}

@Component({
    selector: 'confirm',
    templateUrl: './ideasProyecto.component.html',
})
export class IdeasProyectoModalComponent extends DialogComponent<null, Array<Idea>>
    implements  OnInit {
    
    ideas : Array<Idea> = new Array<Idea>();
    selectedIdeas:Array<Idea> = new Array<Idea>();

    constructor(
        dialogService: DialogService,
        private ideaService: IdeaService,
    ){
        super(dialogService);
        this.ideasProyecto();

    }

    ngOnInit(){

    }

    ideasProyecto(){
        this.ideaService.findByUsuarioPro(localStorage.getItem('user')).
            subscribe((res: Array<Idea>) => {
                this.ideas = res;
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    agregar(idea:Idea){
        this.selectedIdeas.push(idea);
        let i = this.ideas.indexOf(idea,0);
        this.ideas.splice(i,1);
    }

    finalizar(){
        this.result = this.selectedIdeas;
        super.close();
    }
}