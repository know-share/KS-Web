import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-panel',
    templateUrl: './panel-admin.component.html',
    //styleUrls: ['']
})
/**
 * Permite manejar el panel de
 * administración.
 */
export class PanelAdminComponent implements OnInit {

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit(){

    }

    /**
	 * Dirige al administrador
     * hacia el crud.
	 * @param 
	 * @return 
	 */
    onclickCrud(){
        this.router.navigate(['/admin/crud']);
    }

    /**
	 * Dirige al administrador
     * hacia las estadísticas.
	 * @param 
	 * @return 
	 */
    onclickEstadistica(){
        this.router.navigate(['/admin/estadistica']);
    }

    /**
	 * Dirige al administrador
     * hacia las reglas.
	 * @param 
	 * @return 
	 */
    onclickMotor(){
        this.router.navigate(['/admin/rules']);
    }
}