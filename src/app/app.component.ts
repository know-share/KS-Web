import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
/**
 * Clase que maneja el componente
 * principal de la aplicación
 */
export class AppComponent implements OnInit {

    loggeado: boolean = false;
    isAdmin: boolean = false;
    search: string = "";

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

    /**
	 * Verifica la sesión de un 
     * usuario siga existente y
     * verifica su rol.
	 * @param 
	 * @return 
	 */
    ngOnInit(){
        this.loggeado = (localStorage.getItem('user') != null);
        if(this.loggeado)
            this.isAdmin = (localStorage.getItem('role') == 'ADMIN');
    }

    /**
	 * Envía un usuario a su perfil,
     * siempre y cuando no sea admin.
	 * @param 
	 * @return 
	 */
    myProfile() {
        this.router.navigate(['/user', localStorage.getItem('user')]);
    }

    /**
	 * Cierra la sesión de un usuario,
     * y lo envía al login.
	 * @param 
	 * @return 
	 */
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

    /**
	 * Lleva al usuario a buscar y
     * revisa si tiene algún parametro 
     * la busqueda.
	 * @param 
	 * @return 
	 */
    goToSearch(){
        if(this.search != ""){
            this.router.navigate(['/search',this.search]);
        }else{
            this.router.navigate(['/search']);
        }
        this.search = "";
    }

    /**
	 * Si el usuario es admin, lo 
     * envía al leaderboard.
	 * @param 
	 * @return 
	 */
    leaderBoard(){
        this.router.navigate(['/leader']);
    }
}