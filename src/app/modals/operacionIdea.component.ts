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

    aceptar(){
        super.close();
    }

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

    goProfile(username) {
        this.router.navigate(['/user', username]);
        super.close();
    }


    
}