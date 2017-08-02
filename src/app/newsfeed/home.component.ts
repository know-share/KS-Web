import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from "ng2-bootstrap-modal";
import { AutoCompleteModule } from 'primeng/primeng';

import { RequestModalComponent } from '../modals/request.component';
import { ExpirationModalComponent } from '../modals/expiration.component';

import { IdeaService } from '../services/idea.service';
import { UsuarioService } from '../services/usuario.service';
import { TagService } from '../services/tag.service';
import { RuleService } from '../services/rules.service';

import { Idea } from '../entities/idea';
import { Tag } from '../entities/tag';
import { Recomendacion } from '../entities/recomendacion';

import { ComentarModalComponent } from '../modals/comentar.component';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    //styleUrls: ['']
})
export class HomeComponent implements OnInit {

    @ViewChild('friendButton') friendButton: ElementRef;
    @ViewChild('followButton') followButton: ElementRef;

    ideaForm: FormGroup;
    newIdeas: Array<Idea> = new Array;
    idea : Idea = new Idea;
    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;

    listSolicitudes: string[] = [];
    cantidadSolicitudes: number = 0;

    recomendaciones: Recomendacion[] = [];

    tags: Array<Tag> = new Array;
    selectedTags: any[]
    filteredTagsMultiple: any[];

    constructor(
        private fb: FormBuilder,
        private ideaService: IdeaService,
        private router: Router,
        private usuarioService: UsuarioService,
        private dialogService: DialogService,
        private tagService: TagService,
        private ruleService: RuleService,
    ) {
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {
        this.listSolicitudes = [];
        this.cantidadSolicitudes = 0;

        this.refreshSolicitudes();
        this.showTags();
        this.find10();
        this.getRecomendaciones();
    }

    refreshSolicitudes() {
        this.usuarioService.getUsuario(localStorage.getItem('user'))
            .subscribe(
            res => {
                localStorage.setItem("dto", JSON.stringify(res));
                this.listSolicitudes = res.solicitudesAmistad;
                this.cantidadSolicitudes = this.listSolicitudes.length;
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    console.log('Error ' + error);
            }
            );
    }

    getRecomendaciones() {
        this.recomendaciones = [];
        this.ruleService.recomendacionConexiones()
            .subscribe(rec => this.recomendaciones = rec,
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    console.log('Error ' + error);
            });
    }

    goProfile(username) {
        this.router.navigate(['/user', username]);
    }

    removeRecomendacion(username) {
        this.recomendaciones = this.recomendaciones.filter(rec => rec.username != username);
    }

    agregarAmigo(username) {
        this.usuarioService.agregar(username)
            .subscribe(
            res => {
                this.friendButton.nativeElement.innerHTML = 'Petición enviada';
                this.friendButton.nativeElement.disabled = true;
                setTimeout(() => this.removeRecomendacion(username), 2000);
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            }
            );
    }

    seguirUsuario(username) {
        this.usuarioService.seguir(username)
            .subscribe(
            res => {
                this.followButton.nativeElement.innerHTML = 'Siguiendo';
                this.followButton.nativeElement.disabled = true;
                setTimeout(() => this.removeRecomendacion(username), 2000);
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            }
            );
    }

    operacion(ide: Idea) {
        console.log(ide.contenido);
    }

    crearIdea() {
        this.idea.alcance = this.alcance;
        this.idea.tipo = this.selectedValueTipo;
        this.idea.contenido = this.contenido;
        this.idea.numeroEstudiantes = this.numeroEstudiantes;
        this.idea.problematica = this.problematica;
        this.idea.tags = this.selectedTags;
        console.log(this.selectedTags);
        console.log(this.idea);
        this.ideaService.crearIdea(this.idea)
            .subscribe((res: Idea) => {
                this.newIdeas.push(res);
                console.log(res.usuario);
                console.log(this.newIdeas.length);
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });

        this.selectedTags = new Array;
        this.contenido = '';
        this.alcance = '';
        this.problematica = '';
        this.numeroEstudiantes = 0;
    }

    showRequests() {
        let disposable = this.dialogService.addDialog(RequestModalComponent, {
            listSolicitudes: this.listSolicitudes
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshSolicitudes();
                }
            });
    }

    showTags() {
        this.tagService.getAllTags()
            .subscribe((res: Array<Tag>) => {
                this.tags = res;
            }, error => {
                console.log("Error" + error)
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

    find10() {
        this.ideaService.find10().
            subscribe((res: Array<Idea>) => {
                this.newIdeas = res;
            }, error => {
                console.log('error' + error);
            });

    }

    cambio(confirm : Idea){
        if(confirm != null){
            let i = this.newIdeas.indexOf(confirm);
            this.ideaService.findById(confirm.id)
                .subscribe((res : Idea)=>{
                    this.newIdeas.splice(i,1,res);
                })
        }else
            console.log("error")
    }
}