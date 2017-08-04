import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabViewModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { AreaConocimiento } from '../entities/areaConocimiento';
import { DialogModule } from 'primeng/primeng';

@Component({
    selector: 'admin-crud',
    templateUrl: './admin-crud.component.html',
    //styleUrls: ['']
})
export class AdminCrudComponent implements OnInit {

    displayDialog: boolean = true;

    AC: AreaConocimiento = new AreaConocimiento();

    selectedAC: AreaConocimiento;

    newAC: boolean;

    AreasC: AreaConocimiento[] = [];

    area: AreaConocimiento; // por el momento

    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

        for (let i = 0; i < 10; i++) {

            let area = new AreaConocimiento();// por el momento
            area.carrera = "Carrera " + i;
            area.nombre = "Ingeniería " + i;
            area.porcentaje = i;
            this.AreasC.push(area);
        }

    }

    showDialogToAdd() {
        this.newAC = true;
        this.AC = new AreaConocimiento();
        this.displayDialog = true;
    }

    save() {
        let AreasC = [...this.AreasC];
        if (this.newAC)
            AreasC.push(this.AC);
        else
            AreasC[this.findSelectedAreaIndex()] = this.AC;

        this.AreasC = AreasC;
        this.AC = null;
        this.displayDialog = false;
    }

    findSelectedAreaIndex(): number {
        return this.AreasC.indexOf(this.selectedAC);
    }

    delete() {
        let index = this.findSelectedAreaIndex();
        this.AreasC = this.AreasC.filter((val, i) => i != index);
        this.AC = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newAC = false;
        this.AC = this.cloneAC(event.data);
        this.displayDialog = true;
    }

    cloneAC(c: AreaConocimiento): AreaConocimiento {
        let car = new AreaConocimiento();
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}