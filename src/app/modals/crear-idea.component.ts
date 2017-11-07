import { AsociarTGModalComponent } from './asociarTG.component';
import { TrabajoGrado } from './../entities/trabajoGrado';
import { IdeasProyectoModalComponent } from './ideasProyecto.component';
import { TagService } from './../services/tag.service';
import { Tag } from './../entities/tag';
import { Idea } from './../entities/idea';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Router } from '@angular/router';

import {SelectItem} from 'primeng/primeng';

import { IdeaService } from '../services/idea.service';

import { ExpirationModalComponent } from '../modals/expiration.component';

export interface RequestModalDisplay {
    idea: Idea;
}

@Component({
    selector: 'confirm',
    templateUrl: './crear-idea.component.html',
})
/**
 * Modal el cual permite crear una idea.
 */
export class CrearIdeaModalComponent extends DialogComponent<null, Idea>
    implements OnInit {

    @ViewChild('publishButton') publishButton;

    idea: Idea = new Idea();
    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;
    valid: boolean = true;
    selectedTags: any[] = new Array;

    role = localStorage.getItem('role');
    ideasPro: Array<Idea> = new Array();
    tg: TrabajoGrado;
    tags: SelectItem[] = [];

    help_idea = '';

    errorCrearIdea: string;

    constructor(
        dialogService: DialogService,
        private router: Router,
        private ideaService: IdeaService,
        private tagService: TagService
    ) {
        super(dialogService);
        this.selectedValueTipo = 'NU';
        this.help_idea = 'Ideas nuevas son ideas que no tienen un soporte académico aún. Se suelen crear de manera espontánea.';
        this.showTags();
    }

    ngOnInit() {

    }

    /**
     * Verifica que cada campo de informacion este
     * correcto para cada tipo de idea.
     */
    crearIdea() {
        this.errorCrearIdea = '';
        if(!this.selectedTags.length){
            this.valid = false;
            this.errorCrearIdea = 'Por favor, seleccionar al menos un tag.'
            return;
        }
        if (this.selectedValueTipo == "NU")
            if (this.contenido) {
                this.crearIdeaNorm();
            } else {
                this.valid = false;
                this.errorCrearIdea = 'Por favor, completar todos los campos.';
            }
        if (this.selectedValueTipo == "PC")
            if (this.contenido && this.tg) {
                if (this.numeroEstudiantes > 0 && this.numeroEstudiantes < 6)
                    this.crearIdeaNorm();
                else {
                    this.valid = false;
                    this.errorCrearIdea = 'Número de estudiantes debe ser mayor a 0 y menor a 6';
                }
            } else {
                this.valid = false;
                this.errorCrearIdea = 'Por favor, completar todos los campos.';
            }
        if (this.selectedValueTipo == "PE")
            if (this.contenido && this.alcance && this.problematica) {
                if (this.numeroEstudiantes > 0 && this.numeroEstudiantes < 6)
                    this.crearIdeaNorm();
                else {
                    this.valid = false;
                    this.errorCrearIdea = 'Número de estudiantes debe ser mayor a 0 y menor a 6';
                }
            } else {
                this.valid = false;
                this.errorCrearIdea = 'Por favor, completar todos los campos.';
            }
        if (this.selectedValueTipo == "PR")
            if (this.contenido && this.ideasPro.length > 0) {
                this.crearIdeaNorm();
            } else {
                this.valid = false;
                this.errorCrearIdea = 'Por favor, completar todos los campos.';
            }
    }

    /**
     * Crea la idea con la informacion suministrada
     * por el usuario.
     */
    crearIdeaNorm() {
        this.publishButton.nativeElement.disabled = true;
        let temp: Array<Idea> = new Array;
        this.idea.alcance = this.alcance;
        this.idea.tipo = this.selectedValueTipo;
        this.idea.contenido = this.contenido;
        this.idea.numeroEstudiantes = this.numeroEstudiantes;
        this.idea.problematica = this.problematica;
        this.idea.tags = this.selectedTags;
        this.idea.ideasProyecto = this.ideasPro;
        this.idea.tg = this.tg;
        this.ideaService.crearIdea(this.idea)
            .subscribe((res: Idea) => {
                this.result = res;
                super.close();
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
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
     * Agrega las ideas a una idea de tipo proyecto
     */
    agregarIdeas() {
        let disposable = this.dialogService.addDialog(IdeasProyectoModalComponent, {})
            .subscribe(confirmed => {
                if (confirmed) {
                    this.ideasPro = confirmed;
                } else {
                }
            });
    }

    /**
     * Asocia un trabajo de grado a una idea
     * para continuar.
     */	
    asociarTG() {
        let disposable = this.dialogService.addDialog(AsociarTGModalComponent, {})
            .subscribe(confirmed => {
                if (confirmed) {
                    this.tg = confirmed;
                } else {
                }
            });
    }

    /**
     * Cierra el modal
     */
    close() {
        super.close();
    }

    /**
     * Porporciona informacion sobre cada tipo de idea
     */
    onChange(){
        if(this.selectedValueTipo === 'NU')
            this.help_idea = 'Ideas nuevas son ideas que no tienen un soporte académico aún. Se suelen crear de manera espontánea.';
        if(this.selectedValueTipo === 'PE')
            this.help_idea = 'Ideas para empezar se caracterizan por tener ya la problemática, alcance y cantidad de estudiantes definidas.';
        if(this.selectedValueTipo === 'PC')
            this.help_idea = 'Ideas para continuar son aquellas que tienen un trabajo anterior ya realizado y tienen como propósito continuarlo.';
        if(this.selectedValueTipo === 'PR')
            this.help_idea = 'Los proyectos solamente pueden ser creadas por profesores y su propósito es indicar que el profesor posee una suite de ideas con objetivos similares.';
    }
}