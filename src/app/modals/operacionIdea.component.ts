import { OperacionIdea } from './../entities/operacionIdea';
import { IdeaService } from './../services/idea.service';
import { TagService } from './../services/tag.service';
import { Tag } from './../entities/tag';
import { Idea } from './../entities/idea';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { ExpirationModalComponent } from '../modals/expiration.component';

export interface RequestModalDisplay {
    ideaId:string;
    tipo:string;
}

@Component({
    selector: 'confirm',
    templateUrl: './operacionIdea.component.html',
})
/**
 * Permite manejar las operaciones que se hacen sobre una idea
 */
export class OperacionIdeaModalComponent extends DialogComponent<RequestModalDisplay, null>
    implements  OnInit {
    
    ideaId:string;
    operaciones : Array<OperacionIdea>;
    tipo : string;

    constructor(
        dialogService: DialogService,
        private ideaService: IdeaService,
        private router: Router
    ){
        super(dialogService);
        
    }

    ngOnInit(){
        this.operacionesIdea();
    }

    /**
     * Cierra el modal
     */
    aceptar(){
        super.close();
    }

    /**
     * Permite realizar una operación(light o comprartir) sobre
     * una idea.
     */
    operacionesIdea(){
        this.ideaService.findOperacion(this.ideaId,this.tipo)
            .subscribe(res =>{
                this.operaciones = res;
            }, error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    /**
     * Permite ir al perfil de un usuario
     * especifico.
     * @param username perfil del otro usuario
     */
    goProfile(username) {
        this.router.navigate(['/user', username]);
        super.close();
    }


    
}