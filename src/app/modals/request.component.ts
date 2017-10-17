import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

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
                    <p *ngIf="listToShow?.length == 0" >No tiene solicitudes.</p>
                    <div *ngFor="let s of listToShow" >
                        <button (click)="profile(s)" type="button" class="btn btn-link">{{s}}</button>
                        <button (click)="reject(s)" type="button" class="btn btn-danger right">Rechazar</button>
                        <button (click)="accept(s)" type="button" class="btn btn-primary right">Aceptar</button>
                        <hr/>
                    </div>
                    <div class="modal-body center">
                        <ul *ngFor="let p of listPages" class="pagination">
                            <li><a [ngClass]="page == p?'check':''" (click)="loadPage(p-1)" >{{p}}</a></li>
                        </ul>
                    </div>
                   </div>
                 </div>
              </div>`,
    styleUrls: ['../user/user.component.css', '../access/signup.component.css']
})
export class RequestModalComponent extends DialogComponent<RequestModalDisplay, boolean>
    implements RequestModalDisplay, OnInit {

    listSolicitudes: string[];
    listToShow: string[] = [];
    listPages: number[] = [];
    page: number = 1;

    constructor(
        dialogService: DialogService,
        private router: Router,
        private usuarioService: UsuarioService,
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.page = 1;
        this.listPages = [];
        this.listToShow = [];
        let pages = Math.ceil(this.listSolicitudes.length / 5);
        for (let i = 1; i <= pages; i++)
            this.listPages.push(i);
        for (let i = 0; i < this.listSolicitudes.length && i < 5; i++) {
            this.listToShow.push(this.listSolicitudes[i]);
        }
    }

    loadPage(p) {
        this.page = p + 1;
        this.listToShow = [];
        this.listPages = [];
        for (let i = (p * 5); i < ((p * 5) + 5) && i < this.listSolicitudes.length; i++) {
            this.listToShow.push(this.listSolicitudes[i]);
        }
        let pages = Math.ceil(this.listSolicitudes.length / 5);
        for (let i = 1; i <= pages; i++)
            this.listPages.push(i);
        if (this.listToShow.length == 0 && this.listSolicitudes.length > 0)
            this.loadPage(p - 1);
    }

    profile(username) {
        this.close();
        this.router.navigate(['/user', username]);
    }

    accept(username) {
        this.usuarioService.accionSobreSolicitud(username, 'accept')
            .subscribe(
            res => {
                this.listSolicitudes = this.listSolicitudes.filter(user => user != username);
                this.listToShow = this.listToShow.filter(user => user != username);
                this.loadPage(this.page - 1);
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    reject(username) {
        this.usuarioService.accionSobreSolicitud(username, 'reject')
            .subscribe(
            res => {
                this.listSolicitudes = this.listSolicitudes.filter(user => user != username);
                this.listToShow = this.listToShow.filter(user => user != username);
                this.loadPage(this.page - 1);
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    close() {
        this.result = true;
        super.close();
    }
}