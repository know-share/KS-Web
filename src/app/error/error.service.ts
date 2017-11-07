import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Servicio que detecta y guarda 
 * el mensajes de error.
 */
@Injectable()
export class ErrorService {

    private updateSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

    update: Observable<string> = this.updateSubject.asObservable();

    /**
	 * Guarda el mensaje de error.
	 * @param String mensaje   
	 * @return mensaje de error.
	 */
    updateMessage(message: string) {
        this.updateSubject.next(message);
    }
}