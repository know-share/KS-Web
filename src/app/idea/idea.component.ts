import { Component, OnInit, ElementRef, ViewChild, Input ,Output, EventEmitter} from '@angular/core';
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
export class IdeaComponent implements OnInit {
    @Input("idea") idea:Idea;
    @Output() change = new EventEmitter();

    tags:string = '';

    constructor(
        private ideaService:IdeaService,
        private dialogService : DialogService
    ){  }

    ngOnInit(){
        for(var item of this.idea.tags){
            this.tags = this.tags + '#' + item.nombre + ' ';
        }
        console.log(this.tags);
    }

    light(){
        console.log(this.idea);
        let retorno: IdeaHome = new IdeaHome();
        this.ideaService.light(this.idea)
            .subscribe((res :Idea)=> {
                if (res != null) {
                    retorno.idea=this.idea;
                    retorno.operacion="otro";
                    this.change.emit(retorno);
                }
            }, error => {
                this.change.emit(null);
                //console.log("error" + error);
        });
    }

    comentar() {
        let retorno: IdeaHome = new IdeaHome();
        let disposable = this.dialogService.addDialog(ComentarModalComponent, {
            idea: this.idea
        }).subscribe(confirmed => {
                if (confirmed) {
                    retorno.idea=this.idea;
                    retorno.operacion="comentar";
                    this.change.emit(retorno);
                } else {
                    this.change.emit(null);
                }
            });
    }

    compartir(){
        let retorno: IdeaHome = new IdeaHome();
        this.ideaService.compartir(this.idea)
            .subscribe((res : Idea) =>{
                if(res != null){
                    retorno.idea=res;
                    retorno.operacion="compartir";
                    this.change.emit(retorno);
                }else{
                     this.change.emit(null);
                }
            });
    }
}