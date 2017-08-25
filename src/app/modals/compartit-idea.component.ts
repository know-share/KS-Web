import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CarreraService } from '../services/carrera.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Carrera } from '../entities/carrera';

export interface RequestModalDisplay {
    mensaje:string;
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
            <div class="modal-content">
                <h3>{{mensaje}}</h3>
            </div>
        </div>`
})
export class CompartirIdeaModalComponent extends DialogComponent<RequestModalDisplay, null>
    implements RequestModalDisplay, OnInit {

    mensaje : string;    
    
    constructor(
        dialogService: DialogService
    ) {
        super(dialogService);
    }

    ngOnInit() {
        setTimeout(() => super.close(), 2000);
      
    }


    
    close() {
        super.close();
    }
}