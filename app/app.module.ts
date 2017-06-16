import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// Components
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './newsfeed/home.component';
import { SignUpComponent } from './access/signup.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [
        UserComponent,
        HomeComponent,
        SignUpComponent,
        AppComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }