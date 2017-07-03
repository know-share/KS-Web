import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthReverseGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (!localStorage.getItem('user')) {
            return true;
        }

        this.router.navigate(['/home']);
        return false;
    }
}