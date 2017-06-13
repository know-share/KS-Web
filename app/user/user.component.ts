import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'user',
    templateUrl: 'user.component.html',
    //styleUrls: ['']
})
export class UserComponent{

    username: string;
    activeTab: string;

    constructor(
        private activatedRoute: ActivatedRoute,
    ){
        this.username = this.activatedRoute.url.value[1].path;
        this.activeTab = 'ideas';
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