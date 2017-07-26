import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    loggeado: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
        this.authService.isLoggedIn()
            .subscribe(
                logged => this.loggeado = logged
            );
        this.authService.isAdmin()
            .subscribe(
                isUserAdmin => this.isAdmin = isUserAdmin
            );
    }

    ngOnInit(){
        this.loggeado = (localStorage.getItem('user') != null);
        if(this.loggeado)
            this.isAdmin = (localStorage.getItem('role') == 'ADMIN');
    }

    myProfile() {
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