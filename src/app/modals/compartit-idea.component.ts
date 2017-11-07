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
                <div class="msg_share">
                    <h3>{{mensaje}}</h3>
                </div>
            </div>
        </div>`,
    styleUrls: ['compartir-idea.component.css']
})
/**
 * Mensaje que se muestra al compartir
 * una idea.
 */
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

    /**
     * Cierra el modal.
     */
    close() {
        super.close();
    }
}