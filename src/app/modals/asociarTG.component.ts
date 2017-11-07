import { TrabajoGradoService } from './../services/trabajoGrado.service';
import { TrabajoGrado } from './../entities/trabajoGrado';
import { IdeaService } from './../services/idea.service';
import { TagService } from './../services/tag.service';
import { Tag } from './../entities/tag';
import { Idea } from './../entities/idea';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'confirm',
    templateUrl: './asociarTG.component.html',
})
/**
 * Modal que permite elegir un trabajo de grado
 * para asociarse en una idea para continuar
 */
export class AsociarTGModalComponent extends DialogComponent<null, TrabajoGrado>
    implements  OnInit {
    
    tgs : Array<TrabajoGrado> = new Array<TrabajoGrado>();

    constructor(
        dialogService: DialogService,
        private tgService: TrabajoGradoService,
    ){
        super(dialogService);
        this.ideasProyecto();

    }

    ngOnInit(){

    }

     /**
     * Trae todos los trabajos de grado
     * registrados en el sistema.
     */
    ideasProyecto(){
        this.tgService.findAll().
            subscribe((res: Array<TrabajoGrado>) => {
                this.tgs = res;
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    /**
     * Retorna el trabajo de grado
     * seleccionado
     * @param tg trabajo de grado seleccionado
     */
    agregar(tg:TrabajoGrado){
        this.result = tg;
        super.close();
    }
}