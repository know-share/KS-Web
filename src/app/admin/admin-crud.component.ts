import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//Primeng
import { Message } from 'primeng/primeng';

//Entities
import { Carrera } from '../entities/carrera';
import { Tag } from '../entities/tag';
import { Habilidad } from '../entities/habilidad';
import { Enfasis } from '../entities/enfasis';

//Service
import { CarreraService } from '../services/carrera.service';
import { TagService } from '../services/tag.service';
import { HabilidadService } from '../services/habilidad.service';

//Modals
import { CrudCarreraModalComponent } from '../modals/crud-carrera.component';
import { CrudTagModalComponent } from '../modals/crud-tag.component';
import { CrudHabilidadModalComponent } from '../modals/crud-habilidad.component';
import { CrudEnfasisModalComponent } from '../modals/crud-enfasis.component';



@Component({
    selector: 'admin-crud',
    templateUrl: './admin-crud.component.html',
    styleUrls: ['../user/user.component.css']
})
export class AdminCrudComponent implements OnInit {

    activeTab: string;

    // CARRERA
    selectedcarrera: Carrera;
    carreras: Carrera[] = [];

    //TAG
    selectedTag: Tag;
    tags: Tag[] = [];

    //HABILIDAD
    selectedHabilidad: Habilidad;
    habilidades: Habilidad[] = [];

    // ÉNFASIS
    selectedEnfasis: Enfasis;
    enfasisList: Enfasis[] = [];

    msgs: Message[] = [];

    constructor(
        private router: Router,
        private dialogService: DialogService,
        private carreraService: CarreraService,
        private tagService: TagService,
        private habilidadService: HabilidadService
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
        if (this.activeTab == "etiquetas") {
            this.refreshTag();
        }
        if (this.activeTab == "habilidades") {
            this.refreshHabilidad();
        }
        if (this.activeTab == "enfasis" && this.carreras.length == 0) {
            this.refreshCarrera();
        }
        if (this.activeTab == "enfasis" && this.carreras.length > 0) {
            this.refreshEnfasis();
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
            carreras => {
                this.carreras = carreras;
                this.refreshEnfasis();
            },
            error => console.log("Error cargando las carreras " + error)
            );
    }

    createCarrera() {
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

    createTag() {
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

    //----------------------------  Habilidades --------------------------------

    onRowSelectHabilidad(event) {
        let disposable = this.dialogService.addDialog(CrudHabilidadModalComponent, {
            habilidad: this.selectedHabilidad,
            tipo: "update"
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshHabilidad();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Habilidad fue actualizada.' });
                }
            });
    }

    refreshHabilidad() {
        this.habilidadService.getAll()
            .subscribe(
            habilidades => {
                this.habilidades = habilidades;
                for (let h of this.habilidades) {
                    if (h.tipo == "PERSONALES")
                        h.carrera = "No Aplica";
                }
            },
            error => console.log("Error cargando las habilidades " + error)
            );
    }

    createHabilidad() {
        let disposable = this.dialogService.addDialog(CrudHabilidadModalComponent, {
            habilidad: new Habilidad(),
            tipo: "create"
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshHabilidad();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Habilidad fue actualizada.' });
                }
            });
    }


    //----------------------------  ÉNFASIS --------------------------------

    onRowSelectEnfasis(event) {
        let disposable = this.dialogService.addDialog(CrudEnfasisModalComponent, {
            enfasis: this.selectedEnfasis,
            carreras: this.carreras,
            tipo: "update"
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshCarrera();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Énfasis fue actualizada.' });
                }
            });
    }

    refreshEnfasis() {
        let enfasislist: Enfasis[] = [];
        for (let cr of this.carreras) {
            if (cr.enfasis != null) {
                for (let en of cr.enfasis) {
                    let enfasis = new Enfasis();
                    enfasis.carrera = cr.nombre;
                    enfasis.nombre = en;
                    enfasislist.push(enfasis);
                }
            }
        }
        this.enfasisList = enfasislist;
    }

    createEnfasis() {
        let disposable = this.dialogService.addDialog(CrudEnfasisModalComponent, {
            enfasis: new Enfasis(),
            carreras: this.carreras,
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

}