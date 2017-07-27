import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('user')) {
            let role = localStorage.getItem('role');
            if(role && role != 'ADMIN')
                return true;
            else if(role){
                this.router.navigate(['/admin']);
                return false;
            }
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}