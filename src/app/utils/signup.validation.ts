import { AbstractControl } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';

/**
 * Clase que valida el registro
 * de un usuario.
 */
export class SignUpValidation {

    /**
	 * Valida si las contraseñas
     * coinciden.
	 * @param 
	 * @return 
	 */
    static Validate(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true });
        }

        return null;
    }
}