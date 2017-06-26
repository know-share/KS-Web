import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { UserComponent } from './user/user.component';
import { HomeComponent } from './newsfeed/home.component';
import { SignUpComponent } from './access/signup.component';
import { LoginComponent } from './access/login.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'user/:username', component: UserComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'login', component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }