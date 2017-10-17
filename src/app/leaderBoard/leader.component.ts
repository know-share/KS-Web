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

/**
 * Permite manejar el LeaderBoard.
 */
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

    /**
	 * Carga las carreras con su respectiva cantidad de 
     * estudiantes por cada una y la muestra según selecciona
     * el usuario.
	 * @param 
	 * @return Lista de carreras con su cantidad de usuarios..
	 */
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

    /**
	 * Carga los usuarios con más avales
     * de una carrera seleccionada por usuario 
     * y según su tipo.
	 * @param 
	 * @return Lista con los estudiantes.
	 */
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