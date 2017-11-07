import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

import { SelectItem } from 'primeng/primeng';

import { ExpirationModalComponent } from '../modals/expiration.component';

import { Recomendacion } from '../entities/recomendacion';
import { URL_IMAGE_USER } from '../entities/constants';
import { IdeaHome } from './../entities/ideaHome';
import { Idea } from './../entities/idea';
import { Tag } from './../entities/tag';

import { RuleService } from '../services/rules.service';
import { TagService } from './../services/tag.service';
import { IdeaService } from '../services/idea.service';

@Component({
    selector: 'search',
    templateUrl: 'search.component.html',
    styleUrls: ['./search.component.css']
})
/**
 * Maneja la funcionalidad de busqueda.
 */
export class SearchComponent implements OnInit {

    search: string = '';
    searchAdv: string = '';
    option: number = 1;
    optionSelected: number = 1;
    activeTab: string = 'users';
    error: boolean = false;
    filteredTagsMultiple: any[];
    serverUri = URL_IMAGE_USER;
    
    tags: SelectItem[] = [];
    selectedTags: any[] = new Array;

    ideas: Array<Idea>;
    listUsers: Recomendacion[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ruleService: RuleService,
        private dialogService: DialogService,
        private tagService: TagService,
        private ideaService: IdeaService,
    ) {
        this.showTags();
    }

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

    /**
     * Permite moverse entre pestañas.
     * @param tab pestaña destino
     */
    moveTab(tab) {
        this.activeTab = tab;
    }

    /**
     * Transforma las opciones segun la seleccionada.
     */
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

    /**
     * Metodo que realiza las busquedas tanto de ideas como de usuarios
     * segun los criterios dados por el usuario
     * 
     */
    onSearchAdv() {
        if (this.activeTab == 'ideas' && this.option == 6 &&
            this.selectedTags.length == 0) {
            this.error = true;
            return;
        }
        if (this.activeTab == 'users' && this.searchAdv == "") {
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
            if (this.option == 6) {
                this.ruleService.find(this.selectedTags, '/tag')
                    .subscribe(res => {
                        this.ideas = res;
                    }, error => {
                        let disposable;
                        if (error == 'Error: 401')
                            disposable = this.dialogService.addDialog(ExpirationModalComponent);
                        else
                            console.log('Error ' + error);
                    });
                let tagsDisplay = [];
                this.selectedTags.forEach(element => {
                    tagsDisplay.push(element.nombre);
                });
                this.search = 'ideas con tags: ' + tagsDisplay;
            }
            if (this.option == 2) {
                this.buscarIdeas('/continuar');
                this.search = 'ideas para continuar';
            }
            if (this.option == 1) {
                this.buscarIdeas('/nueva');
                this.search = 'ideas nuevas';
            }
            if (this.option == 5) {
                this.buscarIdeas('/proyecto');
                this.search = 'ideas de proyecto';
            }
            if (this.option == 4) {
                this.buscarIdeas('/empezar');
                this.search = 'ideas para empezar';
            }
        }
    }

    /**
     * Metodo encargado de buscar las ideas segun el criterio dado
     * @param criterio tipo de busqueda de idea a realizar
     */
    buscarIdeas(criterio: string) {
        this.ruleService.find(this.selectedTags, criterio)
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

    /**
     * Permite ir al perfil de otro usuario
     * @param username usuario al cual se quiere ir
     */
    goToProfile(username) {
        this.router.navigate(["/user", username]);
    }

    /**
     * Si el usuario no tiene imagen de perfil, carga una por defecto
     * @param event evento de cambio
     * @param username usuario
     * @param genero genero del usuario
     */
    errorImageHandler(event, username, genero) {
        event.target.src = this.imageCard(username, genero);
    }

    /**
     * Retorna el path de la imagen dependiendo del genero
     * @param username usuario
     * @param genero genero del usuario
     */
    imageCard(username, genero): string {
        if (genero == 'Femenino')
            return "images/icons/woman.png";
        else
            return "images/icons/dude4_x128.png";
    }

    /**
     * Trae todos los tags de la base de datos
     */
    showTags() {
        this.tagService.getAllTags()
            .subscribe((res: Array<Tag>) => {
                res.forEach(tag=>{
                    this.tags.push({
                        label: tag.nombre,
                        value: tag
                    });
                });
            }, error => {
                console.log("Error" + error);
            });
    }

    /**
     * Metodo encargado de actualizar los datos de la idea modificada.
     * @param confirm idea la cual se comenta se comparte o se le hace light
     */
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