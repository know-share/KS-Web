import { IdeaHome } from './../entities/ideaHome';
import { Idea } from './../entities/idea';
import { IdeaService } from './../services/idea.service';
import { Tag } from './../entities/tag';
import { TagService } from './../services/tag.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Recomendacion } from '../entities/recomendacion';
import { URL_IMAGE_USER } from '../entities/constants';

import { RuleService } from '../services/rules.service';

@Component({
    selector: 'search',
    templateUrl: 'search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    search: string = '';
    searchAdv: string = '';
    option: number = 1;
    optionSelected: number = 1;
    activeTab: string = 'users';
    error: boolean = false;
    tags: Array<Tag> = new Array;
    filteredTagsMultiple: any[];
    serverUri = URL_IMAGE_USER;
    selectedTags: any[] = new Array;
    ideas: Array<Idea>;
    listUsers: Recomendacion[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ruleService: RuleService,
        private dialogService: DialogService,
        private tagService: TagService,
        private ideaService: IdeaService
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.search = params['query'];
            if (!this.search)
                this.search = '';
            else {
                this.ruleService.buscarUsuario('NOMBRE', this.search)
                    .subscribe(rec => this.listUsers = rec,
                    error => {
                        let disposable;
                        if (error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                        else
                            console.log('Error ' + error);
                    });
            }
        });


    }

    moveTab(tab) {
        this.activeTab = tab;
    }

    transformOption() {
        if (this.activeTab == 'users') {
            if (this.option == 1)
                return 'NOMBRE';
            if (this.option == 2)
                return 'AREA';
            if (this.option == 3)
                return 'HABILIDAD';
        }
    }

    onSearchAdv() {
        if (this.activeTab == 'ideas' && this.option == 6 &&
            this.selectedTags.length == 0) {
            this.error = true;
            return;
        }
        if (this.option != 6 && this.searchAdv == "") {
            this.error = true;
            return;
        }
        this.search = this.searchAdv;
        this.error = false;
        this.listUsers = [];
        this.ideas = [];
        if (this.activeTab == 'users') {
            this.ruleService.buscarUsuario(this.transformOption(), this.searchAdv)
                .subscribe(rec => {
                    this.optionSelected = this.option;
                    this.listUsers = rec;
                    this.search = this.searchAdv;
                }, error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else
                        console.log('Error ' + error);

                });
        }
        if (this.activeTab == 'ideas') {
            if(this.option == 6){
                this.ideaService.find(this.selectedTags,'/tag')
                    .subscribe(res => {
                        this.ideas = res;
                    }, error => {
                        let disposable;

                        if (error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                        else
                            console.log('Error ' + error);
                    });
            }
            if(this.option == 2){
                this.ideaService.find(this.selectedTags,'/continuar ')
                    .subscribe(res => {
                        this.ideas = res;
                    }, error => {
                        let disposable;

                        if (error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                        else
                            console.log('Error ' + error);
                    });
            }
        }
    }

    goToProfile(username) {
        this.router.navigate(["/user", username]);
    }

    errorImageHandler(event, username, genero) {
        event.target.src = this.imageCard(username, genero);
    }

    imageCard(username, genero): string {
        if (genero == 'Femenino')
            return "images/icons/woman.png";
        else
            return "images/icons/dude4_x128.png";
    }

    showTags() {
        this.tagService.getAllTags()
            .subscribe((res: Array<Tag>) => {
                this.tags = res;
            }, error => {
                console.log("Error" + error);
            });
    }

    filterTagMultiple(event) {
        let query = event.query;
        this.tagService.getAllTags().subscribe((tags: Array<Tag>) => {
            this.filteredTagsMultiple = this.filterTag(query, tags);
        });
    }

    filterTag(query, tags: any[]): any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if (tag.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(tag);
            }
        }
        return filtered;
    }
    
    cambio(confirm: IdeaHome) {
        let temp: Array<Idea> = new Array;
        if (confirm != null) {
            let i = this.ideas.indexOf(confirm.idea);
            this.ideaService.findById(confirm.idea.id)
                .subscribe((res: Idea) => {
                    if (confirm.operacion === "compartir") {
                        temp.push(res);
                        temp = temp.concat(this.ideas);
                        this.ideas = temp;
                    } else {
                        this.ideas.splice(i, 1, res);
                    }
                }, error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                });
        } else {
            //pop up con error
        }

    }
}