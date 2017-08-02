import { Component, OnInit, ElementRef, ViewChild, Input ,Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IdeaService } from '../services/idea.service';
import { UsuarioService } from '../services/usuario.service';
import { TagService } from '../services/tag.service';
import { DialogService } from "ng2-bootstrap-modal";

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

    constructor(
        private ideaService:IdeaService,
        private dialogService : DialogService
    ){  }

    ngOnInit(){

    }

    light(){
        this.ideaService.light(this.idea)
            .subscribe((res :Idea)=> {
                if (res != null) {
                    this.change.emit(this.idea);
                    //console.log(res.isLight)
                }
            }, error => {
                this.change.emit(null);
                //console.log("error" + error);
        });
    }

    comentar() {
        let disposable = this.dialogService.addDialog(ComentarModalComponent, {
            idea: this.idea
        }).subscribe(confirmed => {
                if (confirmed) {
                    this.change.emit(this.idea);
                } else {
                    this.change.emit(null);
                }
            });
    }
}