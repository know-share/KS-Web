import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

import { Tag } from './../entities/tag';
import { Idea } from './../entities/idea';
import { Page } from '../entities/page';

import { IdeaService } from './../services/idea.service';
import { TagService } from './../services/tag.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

export interface RequestModalDisplay {
    idea: Idea;
}

@Component({
    selector: 'confirm',
    templateUrl: './ideasProyecto.component.html',
})
/**
 * Controla la asociacion de ideas a una idea de tipo proyecto
 */
export class IdeasProyectoModalComponent extends DialogComponent<null, Array<Idea>>
    implements OnInit {

    ideas: Array<Idea> = new Array<Idea>();
    selectedIdeas: Array<Idea> = new Array<Idea>();

    timestamp: number;
    pageable: Page<Idea> = null;

    constructor(
        dialogService: DialogService,
        private ideaService: IdeaService,
        private lc: NgZone,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.ideas = new Array;
        document.getElementById("ideas-proyecto").onscroll = () => {
            let status = false;
            let item = document.getElementById("ideas-proyecto");
            let windowHeight = item.offsetHeight;
            if( (item.scrollHeight - windowHeight) == item.scrollTop)
                status = true;
            this.lc.run(() => {
                if (status) {
                    if (this.pageable && !this.pageable.last)
                        this.ideasProyecto(this.pageable.number + 1);
                }
            });
        };
        this.timestamp = (new Date).getTime();
        this.ideasProyecto(0);
    }

    /**
     * Trae todas las ideas de un usuario que no sean de 
     * tipo proyecto.
     * @param page pagina
     */
    ideasProyecto(page) {
        this.ideaService.findByUsuarioPro(localStorage.getItem('user'), this.timestamp, page).
            subscribe((res: Page<Idea>) => {
                this.pageable = res;
                this.ideas = this.ideas.concat(this.pageable.content);
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    /**
     * Agrega una idea a la lista de ideas seleccionadas.
     * @param idea idea a agregar
     */
    agregar(idea: Idea) {
        this.selectedIdeas.push(idea);
        let i = this.ideas.indexOf(idea, 0);
        this.ideas.splice(i, 1);
    }

    /**
     * Cierra el modal y devuelve la lista de ideas seleccionadas.
     */
    finalizar() {
        this.result = this.selectedIdeas;
        super.close();
    }
}