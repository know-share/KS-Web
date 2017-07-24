import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'confirm', //modal-dialog
    template: `<div class="modal-dialog" role="document">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="confirm()" >&times;</button>
                     <h4 class="modal-title">Sesión expirada</h4>
                   </div>
                   <div class="modal-body">
                     <p>Su sesión ha expirado, vuelva a ingresar si así lo desea.</p>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-primary" (click)="confirm()">OK</button>
                   </div>
                 </div>
              </div>`
})
export class ExpirationModalComponent extends DialogComponent<void, boolean>{

    constructor(
        dialogService: DialogService,
        private router: Router,
        private authService: AuthService,
    ) {
        super(dialogService);
    }

    confirm(){
        this.logout();
        super.close();
    }

    logout(){
        this.authService.logout()
            .subscribe(res => {
                if (res) {
                    localStorage.clear();
                    this.router.navigate(['/login']);
                }
            }, error => console.log('Error: '+error)
        );
    }
}