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
    tipo: string;
    estado: string;

    constructor(
        dialogService: DialogService,
        private ideaService: IdeaService
    ) {
        super(dialogService);

    }

    ngOnInit() {
        if (this.idea.tipo === 'NU')
            this.tipo = 'Nueva';
        if (this.idea.tipo === 'PC')
            this.tipo = 'Para continuar';
        if (this.idea.tipo === 'PE')
            this.tipo = 'Para empezar';
        if (this.idea.tipo === 'PR')
            this.tipo = 'Proyecto';
        if (this.idea.estado === 'TG')
            this.estado = 'Trabajo de grado';
        if (this.idea.estado === 'NOTG')
            this.estado = 'No trabajo de grado';
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