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
export class AdminRulesComponent implements OnInit {

    checked: boolean;

    msgs: Message[] = [];

    constructor(
        private router: Router,
        private ruleService: RuleService,
        private dialogService: DialogService,
    ) { }

    ngOnInit() {
        this.checked = true;
    }

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
}