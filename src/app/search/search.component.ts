import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';

import { Personalidad } from '../entities/personalidad';

import {  PersonalidadService } from '../services/personalidad.service';

@Component({
    selector: 'search',
    templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit {

    search: string = '';
    searchAdv: string = '';
    option: number = 1;
    activeTab: string = 'users';

    listUsers: Personalidad[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private personalidadService: PersonalidadService,
    ) { }

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.search = params['query'];
            if(!this.search)
                this.search = '';
        });
        // this.personalidadService.getAllPersonalidades()
        //     .subscribe(res=>{
        //         this.listUsers = res;
        //     });
    }

    moveTab(tab){
        this.activeTab = tab;
    }
}