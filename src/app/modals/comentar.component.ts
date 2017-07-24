import { Component, OnInit } from '@angular/core';
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
export class ComentarModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {    

    idea: Idea;
    comentario: string;

    constructor(
        dialogService: DialogService,
        private router: Router,
        private ideaService: IdeaService
    ) {
        super(dialogService);
    }

    ngOnInit() {
      
    }

    comentar(){
        console.log(this.comentario);
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