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
    styleUrls: ['./login.component.css']
})
/**
 * Componente que captura los datos para el 
 * inicio de sesion de un usuario.
 */
export class LoginComponent implements OnInit{

    loginForm: FormGroup;
    username: string;
    password: string;

    errorLogin:boolean = false;

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

    /**
     * Valida las credenciales del usuario y lo redirige
     * a la pagina de inicio si sus credenciales son 
     * correctas.
     */
    login(){
        let auth : Auth = new Auth();
        auth.password = this.password;
        auth.username = this.username;
        this.authService.login(auth)
            .subscribe(res => {
                localStorage.setItem('user',auth.username);
                localStorage.setItem('token',res.token);
                localStorage.setItem('role',res.role);
                this.router.navigate(['/home']);
            },error => {
                this.errorLogin = true;
            });
    }
}