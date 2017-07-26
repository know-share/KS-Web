import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-panel',
    template:`<h1>Admin panel</h1>`
})
export class PanelAdminComponent implements OnInit {

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit(){

    }
}