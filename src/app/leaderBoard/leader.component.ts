import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//PrimeNG
import {DataListModule} from 'primeng/primeng';

//Entities
import { CarreraLeader } from '../entities/carreraLeader';

//Service
import { LudificacionService } from '../services/ludificacion.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'leaderCarrera', 
    templateUrl: './leader.component.html',
})

export class LeaderBoardComponent implements OnInit {
    
    carreras: CarreraLeader[] = [];

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
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
        }
      
    }