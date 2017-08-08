import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//Primeng
import { Message } from 'primeng/primeng';

//Entities
import { Carrera } from '../entities/carrera';

//Service
import { CarreraService } from '../services/carrera.service';

//Modals
import { CrudCarreraModalComponent } from '../modals/crud-carrera.component';


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

    //OTRO

    msgs: Message[] = [];

    constructor(
        private router: Router,
        private dialogService: DialogService,
        private carreraService: CarreraService
    ) { }

    ngOnInit() {
        this.activeTab = "etiquetas";
    }

    moveTab(tab) {
        this.activeTab = tab;
        if (this.activeTab == "carreras") {
            this.refreshCarrera();
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
    //----------------------------  OTRO --------------------------------


}