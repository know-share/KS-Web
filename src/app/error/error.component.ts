import { Component, OnDestroy } from '@angular/core';
import { ErrorService } from './error.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})

/**
 * Maneja el mensaje de error
 * y lo muestra.
 */
export class ErrorComponent implements OnDestroy {

    message: string = '';
    subscription: Subscription;

    constructor(private errorService: ErrorService) {
        this.subscription = this.errorService.update.subscribe(
            message => {
                this.message = message;
            });
    }

    /**
	 * Elimina la suscripción 
     * al servicio de error.
	 * @param 
	 * @return 
	 */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}