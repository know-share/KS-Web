import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//Primeng
import { Message } from 'primeng/primeng';

//Entities
import { Carrera } from '../entities/carrera';
import {Tag} from '../entities/tag';

//Service
import { CarreraService } from '../services/carrera.service';
import {TagService} from '../services/tag.service';

//Modals
import { CrudCarreraModalComponent } from '../modals/crud-carrera.component';
import { CrudTagModalComponent } from '../modals/crud-tag.component';


@Component({
    selector: 'admin-crud',
    templateUrl: './admin-crud.component.html',
    styleUrls: ['../user/user.component.css']
})
export class AdminCrudComponent implements OnInit {

    activeTab: string;

    // CARRERA
    carrera: Carrera = new Carrera();
    selectedcarrera: Carrera;
    carreras: Carrera[] = [];

    //TAG
    tag: Tag = new Tag();
    selectedTag: Tag;
    tags: Tag[] = [];

    msgs: Message[] = [];

    constructor(
        private router: Router,
        private dialogService: DialogService,
        private carreraService: CarreraService,
        private tagService: TagService
    ) { }

    ngOnInit() {
        this.activeTab = "etiquetas";
        this.refreshTag();
    }

    moveTab(tab) {
        this.activeTab = tab;
        if (this.activeTab == "carreras") {
            this.refreshCarrera();
        }
        if(this.activeTab == "etiquetas"){
            this.refreshTag();
        }
    }


    //----------------------------  CARRERA --------------------------------

    onRowSelect(event) { 
        let disposable = this.dialogService.addDialog(CrudCarreraModalComponent, {
            carrera: this.selectedcarrera,
            tipo: "update"
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshCarrera();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Carrera fue actualizada.' });
                }
            });
    }

    refreshCarrera() {
        this.carreraService.getAllCarreras()
            .subscribe(
            carreras => this.carreras = carreras,
            error => console.log("Error cargando las carreras " + error)
            );
    }
    
    createCarrera(){
        let disposable = this.dialogService.addDialog(CrudCarreraModalComponent, {
            carrera: new Carrera(),
            tipo: "create"
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshCarrera();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Carrera fue actualizada.' });
                }
            });
    }


    //----------------------------  TAG --------------------------------

    onRowSelectTag(event) { 
        let disposable = this.dialogService.addDialog(CrudTagModalComponent, {
            tag: this.selectedTag,
            antiguo: this.selectedTag.id,
            tipo: "update"
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshTag();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Tag fue actualizado.' });
                }
            });
    }

    refreshTag() {
        this.tagService.getAllTags()
            .subscribe(
            tags => this.tags = tags,
            error => console.log("Error cargando los tags " + error)
            );
    }
    
    createTag(){
        let disposable = this.dialogService.addDialog(CrudTagModalComponent, {
            tag: new Tag(),
            tipo: "create"
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshTag();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Tag fue actualizado.' });
                }
            });
    }


}