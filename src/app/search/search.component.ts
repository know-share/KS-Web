import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Recomendacion } from '../entities/recomendacion';
import { URL_IMAGE_USER } from '../entities/constants';

import { RuleService } from '../services/rules.service';

@Component({
    selector: 'search',
    templateUrl: 'search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    search: string = '';
    searchAdv: string = '';
    option: number = 1;
    optionSelected: number = 1;
    activeTab: string = 'users';
    error: boolean = false;

    serverUri = URL_IMAGE_USER;

    listUsers: Recomendacion[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ruleService: RuleService,
        private dialogService: DialogService,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.search = params['query'];
            if (!this.search)
                this.search = '';
            else {
                this.ruleService.buscarUsuario('NOMBRE', this.search)
                    .subscribe(rec => this.listUsers = rec,
                    error => {
                        let disposable;
                        if (error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                        else
                            console.log('Error ' + error);
                    });
            }
        });
    }

    moveTab(tab) {
        this.activeTab = tab;
    }

    transformOption() {
        if (this.activeTab == 'users') {
            if (this.option == 1)
                return 'NOMBRE';
            if (this.option == 2)
                return 'AREA';
            if (this.option == 3)
                return 'HABILIDAD';
        }
    }

    onSearchAdv() {
        if (this.searchAdv != "") {
            this.error = false;
            this.listUsers = [];
            if (this.activeTab == 'users') {
                this.ruleService.buscarUsuario(this.transformOption(), this.searchAdv)
                    .subscribe(rec => {
                        this.optionSelected = this.option;
                        this.listUsers = rec;
                        this.search = this.searchAdv;
                    },error => {
                        let disposable;
                        if (error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                        else
                            console.log('Error ' + error);
                    });
            }
        }else{
            this.error = true;
        }
    }

    goToProfile(username){
        this.router.navigate(["/user",username]);
    }

    errorImageHandler(event, username, genero) {
        event.target.src = this.imageCard(username, genero);
    }

    imageCard(username, genero): string {
        if (genero == 'Femenino')
            return "images/icons/woman.png";
        else
            return "images/icons/dude4_x128.png";
    }
}