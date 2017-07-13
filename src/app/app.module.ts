import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

// Components
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './newsfeed/home.component';
import { SignUpComponent } from './access/signup.component';
import { LoginComponent } from './access/login.component';
import { ErrorComponent } from './error/error.component';
import { ProfileComponent } from './user/myprofile.component';
import { RequestModalComponent } from './modals/request.component';
import { ExpirationModalComponent } from './modals/expiration.component';
import { EditCarreraModalComponent } from './modals/edit-carrera.component';
import { AddTGModalComponent } from './modals/add-tg.component';
import { AddFAModalComponent } from './modals/add-fa.component';

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
        FormsModule,
        BootstrapModalModule
    ],
    declarations: [
        UserComponent,
        HomeComponent,
        SignUpComponent,
        AppComponent,
        LoginComponent,
        ErrorComponent,
        ProfileComponent,
        RequestModalComponent,
        ExpirationModalComponent,
        EditCarreraModalComponent,
        AddTGModalComponent,
        AddFAModalComponent
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
    entryComponents:[
        RequestModalComponent,
        ExpirationModalComponent,
        EditCarreraModalComponent,
        AddTGModalComponent,
        AddFAModalComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }