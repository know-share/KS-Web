import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

import {ChartModule} from 'primeng/primeng';
import { Message } from 'primeng/primeng';

import { Carrera } from '../entities/carrera';
import { CarreraService } from '../services/carrera.service';
import { AdminService } from '../services/admin.service';
import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'admin-estadistica',
    templateUrl: './admin-estadistica.component.html',
    styleUrls: ['../user/user.component.css']
})
export class AdminEstadisticaComponent implements OnInit {

    selectedcarrera: Carrera;
    carreras: Carrera[] = [];
    valores: number[]=[];
    data: any;
    dataTags: any;
    msgs: Message[] = [];
    tags: Map<string, number> = new Map<string, number>();
    
    constructor(
        private router: Router,
        private dialogService: DialogService,
        private carreraService: CarreraService,
        private adminService: AdminService,
    ) { }

    ngOnInit() {
        this.refreshCarrera();
        this.refreshTags();
    }


    refreshCarrera() {
        this.carreraService.getAllCarreras()
            .subscribe(
            carreras => {
                this.carreras = carreras;
                this.selectedcarrera = this.carreras[0];
                this.mostrardatos();
            },
            error => {
            this.msgs = [];
            this.msgs.push({ severity: 'fail', summary: 'Error cargando datos', detail: error });
            });
    }

    refreshTags() {
        this.adminService.getTags()
            .subscribe(
            tags => {
               this.tags = tags;
              this.refreshEstadisticaTags();
            },
            error => {
            this.msgs = [];
            this.msgs.push({ severity: 'fail', summary: 'Error cargando datos', detail: error });
            });
    }

    mostrardatos(){
        this.adminService.getAllUsuarios(this.selectedcarrera.nombre)
        .subscribe(
        valores => {
            this.valores = valores;  
            if(valores[0]==0 && valores[1]==0){
                this.msgs = []; 
                this.msgs.push({ severity: 'info', summary: 'Operación exitosa', detail: 'No hay usuarios en la carrera '+this.selectedcarrera.nombre });
                console.log(this.valores[0]+" "+this.valores[1]);  
            }
            this.refreshEstadistica(valores[0],valores[1]); 
                   
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

    refreshEstadistica(m,f){
        this.data = {
            labels: ['Masculino','Femenino'],
            datasets: [
                {
                    data: [m, f],
                    backgroundColor: [
                        "#36A2EB",
                        "#FF6384"
                        
                    ],
                    hoverBackgroundColor: [
                        "#36A2EB",
                        "#FF6384"
                    ]
                }]    
            };
    }

    refreshEstadisticaTags(){
        let l: string[] = [];
        let d: number[] = [];
        for (const key in this.tags) {
            l.push(key);
            d.push(this.tags[key]);
            //console.log('The value for ' + key + ' is = ' + this.tags[key]);
          }

        this.dataTags = {
            labels: l,
            datasets: [
                {
                    data: d,
                    backgroundColor: [
                        "#36A2EB",
                        "#FF6384",
                        "#FFCE56",
                        "#ff0040",
                        "#ff0000",
                        "#00ff40",
                        "#ff8000",
                        "#bf00ff"
                          
                    ],
                    hoverBackgroundColor: [
                        "#36A2EB",
                        "#FF6384",
                        "#FFCE56",
                        "#ff0040",
                        "#ff0000",
                        "#00ff40",
                        "#ff8000",
                        "#bf00ff",
                    ]
                }]    
            };
    }
}    