import { Component, OnDestroy } from '@angular/core';
import { ErrorService } from './error.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnDestroy {

    message: string = '';
    subscription: Subscription;

    constructor(private errorService: ErrorService) {
        this.subscription = this.errorService.update.subscribe(
            message => {
                this.message = message;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}