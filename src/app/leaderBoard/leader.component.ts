import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//PrimeNG
import {DataListModule} from 'primeng/primeng';
import { Message } from 'primeng/primeng';

//Entities
import { CarreraLeader } from '../entities/carreraLeader';

//Service
import { LudificacionService } from '../services/ludificacion.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'leader', 
    templateUrl: './leader.component.html',
})

export class LeaderBoardComponent implements OnInit {
    
    carreras: CarreraLeader[] = [];
    selectedcarrera:CarreraLeader;
    users: CarreraLeader[] = [];
    msgs: Message[] = [];

        constructor(
            private router: Router,
            private ludificacionService: LudificacionService,
            private dialogService: DialogService,
        ) { }
    
        ngOnInit() {
            this.refreshCarrerasLeader();
        }
    
        refreshCarrerasLeader(){
            this.ludificacionService.getAllCarreras()
            .subscribe(
            carreras => {
                this.carreras = carreras;   
                this.selectedcarrera = this.carreras[0]; 
                this.refreshUserLeader();          
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else{
                    this.msgs = [];
                    this.msgs.push({ severity: 'fail', summary: 'Error cargando datos', detail: error });
                }
            });
        }

        refreshUserLeader(){
            this.ludificacionService.getAllEstudiantes(this.selectedcarrera.nombre)
            .subscribe(
            users => {
                this.users = users;     
                console.log(this.users.length); // acá debemos cargar datos        
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else{
                    this.msgs = [];
                    this.msgs.push({ severity: 'fail', summary: 'Error cargando datos', detail: error });
                }
            });
        }
      
    }