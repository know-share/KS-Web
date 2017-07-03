import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    loggeado: boolean;

    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
        this.authService.isLoggedIn()
            .subscribe(
                logged => this.loggeado = logged
            );
    }

    ngOnInit(){
        this.loggeado = (localStorage.getItem('user') != null);
    }

    myProfile() {
        //get from localStorage the username
        this.router.navigate(['/user', localStorage.getItem('user')]);
    }

    logout() {
        this.authService.logout()
            .subscribe(res => {
                if (res) {
                    localStorage.clear();
                    this.router.navigate(['/login']);
                }
            }, error => console.log('Error: '+error)
        );
    }
}