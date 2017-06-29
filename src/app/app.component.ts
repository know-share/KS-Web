import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent{

    constructor(
        private router: Router
    ){}

    myProfile(){
        //get from localStorage the username
        this.router.navigate(['/user',"minmiguelm"]);
    }
}