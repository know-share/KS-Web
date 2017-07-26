import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthAdminGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('user')) {
            let role = localStorage.getItem('role');
            if(role && role == 'ADMIN')
                return true;
            else{
                this.router.navigate(['/home']);
                return false;
            }
        }

        this.router.navigate(['/login']);
        return false;
    }
}