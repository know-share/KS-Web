import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

//Services
import { UsuarioService } from '../services/usuario.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    //styleUrls: ['']
})
export class UserComponent implements OnInit{

    username: string;
    activeTab: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
    ){
        this.activeTab = 'ideas';
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.username = params['username'];
            console.log(this.username);
        })
    }

    ideas(){
        this.activeTab = 'ideas';
    }

    info(){
        this.activeTab = 'info';
    }

    friends(){
        this.activeTab = 'friends';
    }

    followers(){
        this.activeTab = 'followers';
    }

    badges(){
        this.activeTab = 'badges';
    }

    skills(){
        this.activeTab = 'skills';
    }
}