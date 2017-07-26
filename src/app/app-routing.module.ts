import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { UserComponent } from './user/user.component';
import { HomeComponent } from './newsfeed/home.component';
import { SignUpComponent } from './access/signup.component';
import { LoginComponent } from './access/login.component';
import { ErrorComponent } from './error/error.component';

//Components - Admin
import { PanelAdminComponent } from './admin/panel-admin.component';

import { AuthGuard } from './security/auth.guard';
import { AuthReverseGuard } from './security/auth-reverse.guard';
import { AuthAdminGuard } from './security/auth-admin.guard';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'user/:username', component: UserComponent, canActivate: [AuthGuard]},
    { path: 'signup', component: SignUpComponent, canActivate:[AuthReverseGuard] },
    { path: 'login', component: LoginComponent, canActivate:[AuthReverseGuard] },
    { path: 'error', component: ErrorComponent },
    { path: 'admin', component: PanelAdminComponent, canActivate:[AuthAdminGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }