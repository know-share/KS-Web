import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// PrimeNG
import {DataListModule} from 'primeng/primeng';

//Entities
import { CarreraLeader } from '../entities/carreraLeader';

//Service
import { CarreraLeaderService } from '../services/carreraLeader.service';



@Component({
    selector: 'leaderCarrera', 
    templateUrl: './leader.component.html',
})

export class LeaderBoardComponent implements OnInit {
    
    carreras: CarreraLeader[] = [];

        constructor(
            private router: Router,
            private carreraLeaderService: CarreraLeaderService
        ) { }
    
        ngOnInit() {
            this.refreshCarrerasLeader();
        }
    
        refreshCarrerasLeader(){
            this.carreraLeaderService.getAllCarreras()
            .subscribe(
            carreras => {
                this.carreras = carreras;              
            },
            error => console.log("Error cargando las carreras " + error)
            );
        }
      
    }