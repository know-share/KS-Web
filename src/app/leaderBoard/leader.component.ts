import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//PrimeNG
import { DataListModule } from 'primeng/primeng';
import { Message } from 'primeng/primeng';

//Entities
import { CarreraLeader } from '../entities/carreraLeader';
import { Usuario } from '../entities/usuario';

//Service
import { LudificacionService } from '../services/ludificacion.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'leader',
    templateUrl: './leader.component.html',
})

export class LeaderBoardComponent implements OnInit {

    carreras: CarreraLeader[] = [];
    carrerasUsuario: CarreraLeader[] = [];
    selectedcarrera: CarreraLeader;
    users: CarreraLeader[] = [];
    tipo: string;
    msgs: Message[] = [];

    user: Usuario;

    constructor(
        private router: Router,
        private ludificacionService: LudificacionService,
        private dialogService: DialogService,
    ) { }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('dto'));
        this.tipo = localStorage.getItem('role') == 'EGRESADO' ? 'PROFESOR' : localStorage.getItem('role');
        this.refreshCarrerasLeader();
    }

    refreshCarrerasLeader() {
        this.ludificacionService.getAllCarreras()
            .subscribe(
            carreras => {
                this.carreras = carreras;
                this.carrerasUsuario = this.carreras.filter(c => 0 == 0);
                this.carrerasUsuario.sort((a, b) => {
                    if (a.nombre < b.nombre)
                        return -1;
                    if (a.nombre > b.nombre)
                        return 1;
                    return 0;
                });
                this.selectedcarrera = this.carrerasUsuario.find(c => c.nombre == this.user.carrera.nombre);
                this.refreshUserLeader();
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else {
                    this.msgs = [];
                    this.msgs.push({ severity: 'fail', summary: 'Error cargando datos', detail: error });
                }
            });
    }

    refreshUserLeader() {
        this.ludificacionService.getAllEstudiantes(this.selectedcarrera.id, this.tipo)
            .subscribe(
            users => {
                this.users = users;
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else {
                    this.msgs = [];
                    this.msgs.push({ severity: 'fail', summary: 'Error cargando datos', detail: error });
                }
            });
    }

}