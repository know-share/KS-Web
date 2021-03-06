import { CompartirIdeaModalComponent } from './../modals/compartit-idea.component';
import { OperacionIdeaModalComponent } from './../modals/operacionIdea.component';
import { DetalleIdeaModalComponent } from './../modals/idea-detalles.component';
import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IdeaService } from '../services/idea.service';
import { UsuarioService } from '../services/usuario.service';
import { TagService } from '../services/tag.service';
import { DialogService } from "ng2-bootstrap-modal";

import { IdeaHome } from './../entities/ideaHome';
import { Idea } from '../entities/idea';
import { Tag } from '../entities/tag';

import { ComentarModalComponent } from '../modals/comentar.component';

@Component({
    selector: 'idea',
    templateUrl: './idea.component.html',
    //styleUrls: ['']
})
/**
 * Permite el manejo de idea con 
 * todas sus operaciones     
 */
export class IdeaComponent implements OnInit {
    @Input("idea") idea: Idea;
    @Output() change = new EventEmitter();

    tags: string = '';

    username: string = '';

    constructor(
        private ideaService: IdeaService,
        private dialogService: DialogService,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.idea.tags != null) {
            for (var item of this.idea.tags) {
                this.tags = this.tags + ' ' + item.nombre + ' ';
            }
            //console.log(this.tags);
        }
        this.username = localStorage.getItem('user');
    }

    /**
     * Permite hacer light a una idea o quitarlo
     * si esta ya tiene light de este usuario.
     */
    light() {
        let retorno: IdeaHome = new IdeaHome();
        this.ideaService.light(this.idea)
            .subscribe((res: Idea) => {
                if (res != null) {
                    retorno.idea = this.idea;
                    retorno.operacion = "otro";
                    this.change.emit(retorno);
                }
            }, error => {
                this.change.emit(null);
                //console.log("error" + error);
            });
    }

    /**
     * Permite comentar una idea.
     */
    comentar() {
        let retorno: IdeaHome = new IdeaHome();
        let disposable = this.dialogService.addDialog(ComentarModalComponent, {
            idea: this.idea
        }).subscribe(confirmed => {
            if (confirmed) {
                retorno.idea = this.idea;
                retorno.operacion = "comentar";
                this.change.emit(retorno);
            } else {
                this.change.emit(null);
            }
        });
    }

    /**
     * Permite compartir una idea de otro usuario
     * que no sea de tipo proyecto.
     */
    compartir() {
        let retorno: IdeaHome = new IdeaHome();
        if (this.idea.usuario != localStorage.getItem('user')) {
            this.ideaService.compartir(this.idea)
                .subscribe((res: Idea) => {
                    if (res != null) {
                        retorno.idea = res;
                        retorno.operacion = "compartir";
                        this.change.emit(retorno);
                        let disposable = this.dialogService.addDialog(CompartirIdeaModalComponent, {
                            mensaje: "Idea compartida exitosamente."
                        }).subscribe(
                            confirmed => true);
                    } else {
                        this.change.emit(null);
                    }
                });
        } else {
            let disposable = this.dialogService.addDialog(CompartirIdeaModalComponent, {
                mensaje: "No puede compartir su propia idea."
            }).subscribe(
                confirmed => {
                    if (confirmed) {

                    }
                });
        }
    }

    /**
     * Permite ir al perfil de un usuario
     * especifico.
     * @param username perfil del otro usuario
     */
    goProfile(username) {
        this.router.navigate(['/user', username]);
    }

    /**
     * Permite ver los detalles generales de 
     * la idea.
     */
    detalles() {
        let disposable = this.dialogService.addDialog(DetalleIdeaModalComponent, {
            idea: this.idea
        }).subscribe(confirmed => {
            this.idea = confirmed;
        });
    }

    /**
     * Permite ver los usuarios que han
     * dado light a la idea.
     */
    detallesLight() {
        let disposable = this.dialogService.addDialog(OperacionIdeaModalComponent, {
            ideaId: this.idea.id,
            tipo: 'light'
        }).subscribe(confirmed => {

        });
    }

    /**
     * Permite ver los comentarios que le han
     * hecho a la idea
     */
    detallesComentarios() {
        let disposable = this.dialogService.addDialog(OperacionIdeaModalComponent, {
            ideaId: this.idea.id,
            tipo: 'comentarios'
        }).subscribe(confirmed => {

        });
    }
}