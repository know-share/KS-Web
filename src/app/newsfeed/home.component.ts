import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from "ng2-bootstrap-modal";
import { NgZone } from '@angular/core';

//primeng
import { Message } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { IdeaService } from '../services/idea.service';
import { UsuarioService } from '../services/usuario.service';
import { TagService } from '../services/tag.service';
import { RuleService } from '../services/rules.service';

import { Idea } from '../entities/idea';
import { IdeaHome } from './../entities/ideaHome';
import { Tag } from '../entities/tag';
import { Page } from '../entities/page';
import { Recomendacion } from '../entities/recomendacion';

import { ComentarModalComponent } from '../modals/comentar.component';
import { CrearIdeaModalComponent } from './../modals/crear-idea.component';
import { RequestModalComponent } from '../modals/request.component';
import { ExpirationModalComponent } from '../modals/expiration.component';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    ideaForm: FormGroup;
    newIdeas: Array<Idea> = new Array;
    idea: Idea = new Idea;
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

    preferenciaDespliegue: string = "";

    pageable: Page<Idea> = null;

    msgs: Message[] = [];

    constructor(
        private fb: FormBuilder,
        private ideaService: IdeaService,
        private router: Router,
        private usuarioService: UsuarioService,
        private dialogService: DialogService,
        private tagService: TagService,
        private ruleService: RuleService,
        private lc: NgZone,
    ) {
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {
        window.onscroll = () => {
            let status = false;
            let windowHeight = "innerHeight" in window ? window.innerHeight
                : document.documentElement.offsetHeight;
            let body = document.body, html = document.documentElement;
            let docHeight = Math.max(body.scrollHeight,
                body.offsetHeight, html.clientHeight,
                html.scrollHeight, html.offsetHeight);
            let windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {
                status = true;
            }
            this.lc.run(() => {
                if (status && localStorage.length && localStorage.getItem('role') !== 'ADMIN') {
                    if (this.pageable && !this.pageable.last)
                        this.findRed(this.pageable.number + 1);
                }
            });
        };
        this.listSolicitudes = [];
        this.cantidadSolicitudes = 0;
        this.newIdeas = new Array;
        this.findRed(0);
    }

    refreshSolicitudes() {
        this.usuarioService.getUsuario(localStorage.getItem('user'))
            .subscribe(
            res => {
                localStorage.setItem("dto", JSON.stringify(res));
                this.listSolicitudes = res.solicitudesAmistad;
                this.cantidadSolicitudes = this.listSolicitudes.length;
                this.preferenciaDespliegue = res.preferenciaIdea;
                this.getRecomendaciones();
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    this.getRecomendaciones();
            });
    }

    getRecomendaciones() {
        this.recomendaciones = [];
        this.ruleService.recomendacionConexiones()
            .subscribe(rec => this.recomendaciones = rec,
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    goProfile(username) {
        this.router.navigate(['/user', username]);
    }

    removeRecomendacion(username) {
        this.recomendaciones = this.recomendaciones.filter(rec => rec.username != username);
    }

    agregarAmigo(username, i) {
        this.usuarioService.agregar(username)
            .subscribe(
            res => {
                (<HTMLInputElement>document.getElementById('friend_button_'+i)).innerHTML = 'Petición enviada';
                (<HTMLInputElement>document.getElementById('friend_button_'+i)).disabled = true;
                setTimeout(() => this.removeRecomendacion(username), 2000);
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    seguirUsuario(username, i) {
        this.usuarioService.seguir(username)
            .subscribe(
            res => {
                (<HTMLInputElement>document.getElementById('friend_button_'+i)).innerHTML = 'Siguiendo';
                (<HTMLInputElement>document.getElementById('friend_button_'+i)).disabled = true;
                setTimeout(() => this.removeRecomendacion(username), 2000);
            },
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    accept(username, i) {
        this.usuarioService.accionSobreSolicitud(username, 'accept')
            .subscribe(
            res => {
                (<HTMLInputElement>document.getElementById('del_button_'+i)).disabled = true;
                (<HTMLInputElement>document.getElementById('add_button_'+i)).innerHTML = 'Agregado';
                (<HTMLInputElement>document.getElementById('add_button_'+i)).disabled = true;
                setTimeout(() => {
                    this.removeRecomendacion(username);
                    this.refreshSolicitudes();
                }, 2000);
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    reject(username, i) {
        this.usuarioService.accionSobreSolicitud(username, 'reject')
            .subscribe(
            res => {
                (<HTMLInputElement>document.getElementById('add_button_'+i)).disabled = true;
                (<HTMLInputElement>document.getElementById('del_button_'+i)).innerHTML = 'Rechazado';
                (<HTMLInputElement>document.getElementById('del_button_'+i)).disabled = true;
                setTimeout(() => {
                    this.removeRecomendacion(username);
                    this.refreshSolicitudes();
                }, 2000);
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    existRequest(username) {
        return this.listSolicitudes.find(r => r.toLowerCase() === username.toLowerCase());
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
                this.refreshSolicitudes();
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else {
                    console.log('Error ' + error);
                    this.refreshSolicitudes();
                }
            });
    }

    filterTagMultiple(event) {
        let query = event.query;
        this.tagService.getAllTags().subscribe((tags: Array<Tag>) => {
            this.filteredTagsMultiple = this.filterTag(query, tags);
        });
    }

    filterTag(query, tags: any[]): any[] {
        let filtered: any[] = [];
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if (tag.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(tag);
            }
        }
        return filtered;
    }

    findRed(page) {
        this.ruleService.findRed(page).
            subscribe((res: Page<Idea>) => {
                this.pageable = res;
                this.newIdeas = this.newIdeas.concat(this.pageable.content);
                this.showTags();
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    this.showTags();
            });
    }

    cambio(confirm: IdeaHome) {
        let temp: Array<Idea> = new Array;
        if (confirm != null) {
            let i = this.newIdeas.indexOf(confirm.idea);
            this.ideaService.findById(confirm.idea.id)
                .subscribe((res: Idea) => {
                    if (confirm.operacion === "compartir") {
                        console.log(res.tg.nombre);
                        temp.push(res);
                        temp = temp.concat(this.newIdeas);
                        this.newIdeas = temp;
                    } else {
                        this.newIdeas.splice(i, 1, res);
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

    crearIdea() {
        let temp: Array<Idea> = new Array;
        let disposable = this.dialogService.addDialog(CrearIdeaModalComponent, {})
            .subscribe(confirmed => {
                if (confirmed) {
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Idea publicada', detail: 'Tu idea ha sido publicada exitosamente.' });
                    temp.push(confirmed);
                    temp = temp.concat(this.newIdeas);
                    this.newIdeas = temp;
                } else {
                    //pop up con error 
                }
            });
    }

    updatePreferencia(event) {
        this.usuarioService.updatePreferencia(this.preferenciaDespliegue)
            .subscribe(
            res => {
                this.newIdeas = [];
                this.findRed(0);
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }
}