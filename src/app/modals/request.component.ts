import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';

export interface RequestModalDisplay {
    listSolicitudes: string[];
}

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                     <h4 class="modal-title">Solicitudes de amistad</h4>
                   </div>
                   <div class="modal-body">
                    <p *ngIf="listSolicitudes?.length == 0" >No tiene solicitudes.</p>
                    <div *ngFor="let s of listSolicitudes" >
                        <button (click)="profile(s)" type="button" class="btn btn-link">{{s}}</button>
                        <button (click)="reject(s)" type="button" class="btn btn-danger right">Rechazar</button>
                        <button (click)="accept(s)" type="button" class="btn btn-primary right">Aceptar</button>
                        <hr/>
                    </div>
                    <div class="modal-body center">
                        <ul class="pagination">
                            <li><a href="#">1</a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                            <li><a href="#">4</a></li>
                            <li><a href="#">5</a></li>
                        </ul>
                    </div>
                   </div>
                 </div>
              </div>`,
    styleUrls: ['../user/user.component.css']
})
export class RequestModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay {

    listSolicitudes: string[];

    constructor(
        dialogService: DialogService,
        private router: Router,
        private usuarioService:UsuarioService,
    ) {
        super(dialogService);
    }

    profile(username){
        this.close();
        this.router.navigate(['/user', username]);
    }

    accept(username){
        this.usuarioService.accionSobreSolicitud(username,'accept')
            .subscribe(
                res => {
                    this.listSolicitudes = this.listSolicitudes.filter(user => user != username);
                },
                error => console.log()
            );
    }

    reject(username){
        this.usuarioService.accionSobreSolicitud(username,'reject')
            .subscribe(
                res => {
                    this.listSolicitudes = this.listSolicitudes.filter(user => user != username);
                },
                error => console.log()
            );
    }

    close(){
        this.result = true;
        super.close();
    }
}