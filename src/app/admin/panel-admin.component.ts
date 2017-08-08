import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-panel',
    templateUrl: './panel-admin.component.html',
    //styleUrls: ['']
})
export class PanelAdminComponent implements OnInit {

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit(){

    }

    onclickCrud(){
        this.router.navigate(['/admin/crud']);
    }
}