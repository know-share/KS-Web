import { OperacionIdeaModalComponent } from './modals/operacionIdea.component';
import { OperacionIdea } from './entities/operacionIdea';
import { DetalleIdeaModalComponent } from './modals/idea-detalles.component';
import { AsociarTGModalComponent } from './modals/asociarTG.component';
import { IdeasProyectoModalComponent } from './modals/ideasProyecto.component';
import { TrabajoGradoService } from './services/trabajoGrado.service';
import { CrearIdeaModalComponent } from './modals/crear-idea.component';
import { NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import {ScrollPointDirective} from './directives/scroll-point.component';

//primeng
import {GrowlModule} from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/primeng';
import {DataListModule} from 'primeng/primeng';
import {DataTableModule,SharedModule} from 'primeng/primeng';

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
import { EditHabilidadModalComponent } from './modals/edit-habilidad.component';
import { EditBasisModalComponent } from './modals/edit-basis.component';
import { ComentarModalComponent } from './modals/comentar.component';
import { SearchComponent } from './search/search.component';
import { IdeaComponent } from './idea/idea.component';
import { UploadImageModalComponent } from './modals/upload-image.component';
import { CrudCarreraModalComponent } from './modals/crud-carrera.component';
import { CrudTagModalComponent } from './modals/crud-tag.component';


// Components - Admin
import { PanelAdminComponent } from './admin/panel-admin.component';
import {AdminCrudComponent} from './admin/admin-crud.component';

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
import { TagService } from './services/tag.service';
import { RuleService } from './services/rules.service';


import { AuthGuard } from './security/auth.guard';
import { AuthReverseGuard } from './security/auth-reverse.guard';
import { AuthAdminGuard } from './security/auth-admin.guard';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        BootstrapModalModule,
        GrowlModule,
        DataListModule,
        AutoCompleteModule,
        DataTableModule,
        SharedModule
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
        AddFAModalComponent,
        EditHabilidadModalComponent,
        EditBasisModalComponent,
        ComentarModalComponent,
        PanelAdminComponent,
        ScrollPointDirective,
        SearchComponent,
        IdeaComponent,
        AdminCrudComponent,
        CrearIdeaModalComponent,
        IdeasProyectoModalComponent,
        AsociarTGModalComponent,
        UploadImageModalComponent,
        CrudCarreraModalComponent,
        DetalleIdeaModalComponent,
        CrudTagModalComponent,
        OperacionIdeaModalComponent

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
        AuthAdminGuard,
        IdeaService,
        TagService,
        RuleService,
        TrabajoGradoService
    ],
    entryComponents:[
        RequestModalComponent,
        ExpirationModalComponent,
        EditCarreraModalComponent,
        AddTGModalComponent,
        AddFAModalComponent,
        EditHabilidadModalComponent,
        EditBasisModalComponent,
        ComentarModalComponent,
        CrearIdeaModalComponent,
        IdeasProyectoModalComponent,
        AsociarTGModalComponent,
        UploadImageModalComponent,
        CrudCarreraModalComponent,
        DetalleIdeaModalComponent,
        CrudTagModalComponent,
        OperacionIdeaModalComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }