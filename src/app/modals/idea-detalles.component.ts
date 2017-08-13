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
    templateUrl: './idea-detalles.component.html',
})
export class DetalleIdeaModalComponent extends DialogComponent<RequestModalDisplay, null>
    implements  OnInit {
    
    idea:Idea;
    tipo : string;

    constructor(
        dialogService: DialogService
    ){
        super(dialogService);
        
    }

    ngOnInit(){
        if(this.idea.tipo === 'NU')
            this.tipo = 'Nueva';
        if(this.idea.tipo === 'PC')
           this.tipo = 'Para continuar';
        if(this.idea.tipo === 'PE')
            this.tipo = 'Para empezar';
        if(this.idea.tipo === 'PR')
            this.tipo = 'Proyecto';

        console.log(this.idea.numeroEstudiantes);
    }

    aceptar(){
        super.close();
    }

    
}