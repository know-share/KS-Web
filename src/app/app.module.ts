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
import { LoginComponent } from './access/login.component';
import { ErrorComponent } from './error/error.component';

//Services
import { PersonalidadService } from './services/personalidad.service';
import { CarreraService } from './services/carrera.service';
import { UsuarioService } from './services/usuario.service';
import { GustoService } from './services/gusto.service';
import { HabilidadService } from './services/habilidad.service';
import { CualidadService } from './services/cualidad.service';
import { AuthService } from './services/auth.service';
import { ErrorService } from './error/error.service';
import { IdeaService } from './services/idea.service';

import { AuthGuard } from './security/auth.guard';
import { AuthReverseGuard } from './security/auth-reverse.guard';

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
        AppComponent,
        LoginComponent,
        ErrorComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    },
        PersonalidadService,
        CarreraService,
        UsuarioService,
        GustoService,
        HabilidadService,
        CualidadService,
        AuthService,
        ErrorService,
        AuthGuard,
        AuthReverseGuard,
        IdeaService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }