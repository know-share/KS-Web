import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//primeng
import { Message } from 'primeng/primeng';

//Entities
import { Carrera } from '../entities/carrera';

import { CrudCarreraModalComponent } from '../modals/crud-carrera.component';

import { CarreraService } from '../services/carrera.service';


@Component({
    selector: 'admin-crud',
    templateUrl: './admin-crud.component.html',
    //styleUrls: ['']
})
export class AdminCrudComponent implements OnInit {

    activeTab: string;
    displayDialog: boolean;

    carrera: Carrera = new Carrera();
    selectedcarrera: Carrera;
    newcarrera: boolean;
    carreras: Carrera[] = [];

    msgs: Message[] = [];

    constructor(
        private router: Router,
        private dialogService: DialogService,
        private carreraService: CarreraService
    ) { }

    ngOnInit() {

    }

    showDialogToAdd() {
        this.newcarrera = true;
        this.carrera = new Carrera();
        this.displayDialog = true;
    }

    findSelectedAreaIndex(): number {
        return this.carreras.indexOf(this.selectedcarrera);
    }

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

    //-------------------------------

    refreshCarrera() {
        this.carreraService.getAllCarreras()
            .subscribe(
            carreras => this.carreras = carreras,
            error => console.log("Error cargando las carreras " + error)
            );
    }
    moveTab(tab) {
        this.activeTab = tab;
        if (this.activeTab == "carreras") {
            this.refreshCarrera();
        }
    }

    editCarrera() {
        if (this.carrera != null) {
            let disposable = this.dialogService.addDialog(CrudCarreraModalComponent, {
                carrera: this.carrera
            }).subscribe(
                confirmed => {
                    if (confirmed) {
                        //  this.refreshUsuario();
                        //  this.msgs = [];
                        //  this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Información personal fue actualizada.'});
                        console.log("se supone que confirmo en admin crud");
                    }
                });
        }

    }

}