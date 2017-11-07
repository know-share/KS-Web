import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { IdeaService } from '../services/idea.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Idea } from '../entities/idea';
import {Comentario} from '../entities/comentario';

export interface RequestModalDisplay {
    idea : Idea;
}

@Component({
    selector: 'confirm',
    templateUrl: './comentar.component.html',
})
/**
 * Modal que permite realizar comentarios
 * a una idea
 */
export class ComentarModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay {    

    idea: Idea;
    comentario: string;

    errorVacio: string = '';
    valid: boolean = true;

    constructor(
        dialogService: DialogService,
        private router: Router,
        private ideaService: IdeaService
    ) {
        super(dialogService);
    }
    /**
     * Guarda nuevo comentario y lo asocia a 
     * una idea.
     */
    comentar(){
        if(!this.comentario){
            this.valid = false;
            this.errorVacio = 'Agregue un comentario.';
            return;
        }
        let params : Comentario = new Comentario;
        params.comentario = this.comentario;
        params.idea = this.idea;
        this.ideaService.comentar(params)
            .subscribe(res =>{
                this.result = res;
                super.close()
            });
    }

    
}