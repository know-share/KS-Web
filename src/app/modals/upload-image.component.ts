import { Component, OnInit, ElementRef } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';

import { ExpirationModalComponent } from './expiration.component';

@Component({
    selector: 'confirm',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                     <h4 class="modal-title">Imagen de perfil</h4>
                   </div>
                   <div class="modal-body center">
                    <input accept="image/*" (change)="changeListener($event)" type="file" class="form-control" />
                    <br>
                    <img class="img-thumbnail" />
                   </div>
                   <div class="modal-footer">
                    <button [disabled]="!valid" (click)="upload()" class="btn btn-primary btn-block" >Actualizar imagen</button>
                   </div>
                 </div>
              </div>`
})
export class UploadImageModalComponent extends DialogComponent<void, boolean>
    implements OnInit {

    valid: boolean = false;
    uploadedImage = null;

    constructor(
        dialogService: DialogService,
        private router: Router,
        private usuarioService: UsuarioService,
        private element: ElementRef,
    ) {
        super(dialogService);
    }

    ngOnInit() {

    }

    close() {
        this.result = false;
        super.close();
    }

    changeListener(event) {
        var reader = new FileReader();
        var image = this.element.nativeElement.querySelector('.img-thumbnail');

        let file = event.target.files[0];
        if (!file.name.match(/.(jpg|jpeg|png)$/i)){
            alert('Imagen no permitida, solo se aceptan imágenes formato: JPG, JPEG o PNG.');
            this.valid = false;
        }else if(file.size < 1000000){
            reader.onload = function (e: any) {
                var src = e.target.result;
                image.src = src;
            };

            reader.readAsDataURL(file);
            this.uploadedImage = file;
            this.valid = true;
        }else{
            alert('Imagen muy pesada, imagen máximo de 1MB.');
            this.valid = false;
        }
    }

    upload() {
        let formData = new FormData();
        formData.append('file',this.uploadedImage);
        this.usuarioService.upload(formData)
            .subscribe(
                ok => {
                    this.result = true;
                    super.close();
                },error => {
                    this.result = false;
                    let disposable;
                    if(error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else{
                        console.log('error: '+error);
                    }
                    super.close();
                }
            );
    }
}