import { IdeaService } from './../services/idea.service';
import { TagService } from './../services/tag.service';
import { Tag } from './../entities/tag';
import { Idea } from './../entities/idea';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { ExpirationModalComponent } from '../modals/expiration.component';

export interface RequestModalDisplay {
    idea: Idea;
}

@Component({
    selector: 'confirm',
    templateUrl: './idea-detalles.component.html',
})
export class DetalleIdeaModalComponent extends DialogComponent<RequestModalDisplay, Idea>
    implements OnInit {

    usuario: string = localStorage.getItem('user');
    idea: Idea;

    constructor(
        dialogService: DialogService,
        private ideaService: IdeaService
    ) {
        super(dialogService);

    }

    ngOnInit() {
    }

    getEstado(idea){
        if (idea.estado === 'TG')
            return 'Trabajo de grado';
        if (idea.estado === 'NOTG')
            return 'No trabajo de grado';
    }

    getTipo(idea){
        if (idea.tipo === 'NU')
            return 'Nueva';
        if (idea.tipo === 'PC')
            return 'Para continuar';
        if (idea.tipo === 'PE')
            return 'Para empezar';
        if (idea.tipo === 'PR')
            return 'Proyecto';
    }

    aceptar() {
        this.result = this.idea;
        super.close();
    }

    cambiarEstado() {
        let estado;
        if (this.idea.estado === "TG") {
            this.idea.estado = "NOTG";
        } else {
            this.idea.estado = "TG";
        }
        this.ideaService.cambiarEstado(this.idea)
            .subscribe(res => {
                this.result = res;
                super.close()
            });
    }
}