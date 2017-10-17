import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//primeng
import { Message } from 'primeng/primeng';

import { RuleService } from '../services/rules.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'admin-rules',
    templateUrl: './admin-rules.component.html',
    styleUrls: ['./admin-rules.component.css', '../user/user.component.css']
})

/**
 * Permite manejar el motor de reglas.
 */
export class AdminRulesComponent implements OnInit {

    checked: boolean;

    msgs: Message[] = [];

    constructor(
        private router: Router,
        private ruleService: RuleService,
        private dialogService: DialogService,
    ) { }

    
    ngOnInit() {
        this.ruleService.getRulesPreferences()
            .subscribe(
            ok => this.checked = ok,
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    /**
	 * Llama el servicio de reglas
     * para cargar y actualizar las mismas.
	 * @param 
	 * @return Las reglas actualizadas o un mensaje de error.
	 */
    updateRules() {
        this.ruleService.update()
            .subscribe(
            res => {
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Las reglas han sido actualizadas.' });
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Error conexión', detail: 'Inténtelo más tarde.' });
                }
            });
    }

    /**
	 * Habilida y deshabilita las reglas
     * en el sistema.
	 * @param 
	 * @return Habilitado/deshabilitado, en caso de
     * error un mensaje.
	 */
    handleChange(event) {
        let state = this.checked ? 1 : 0;
        let msg = this.checked ? 'habilitadas' : 'deshabilitadas';
        this.ruleService.updateRulesPreferences(state)
            .subscribe(res => {
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: `Las reglas han sido ${msg}.` });
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Error conexión', detail: 'Inténtelo más tarde.' });
                }
            });
    }
}