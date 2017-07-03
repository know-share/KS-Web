import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//service
import { AuthService } from '../services/auth.service';

//entities
import { Auth } from '../entities/auth'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    //styleUrls: ['']
})
export class LoginComponent implements OnInit{

    loginForm: FormGroup;
    username: string;
    password: string;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ){}

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            pass: ['', Validators.required]
            
        });
    }

    login(){
        let auth : Auth = new Auth();
        auth.password = this.password;
        auth.username = this.username;
        this.authService.login(auth)
            .subscribe(res => {
                localStorage.setItem('user',auth.username);
                localStorage.setItem('token',res.token);
                this.router.navigate(['/home']);
            },error => {
                console.log('Error: '+error);
            });
    }
}