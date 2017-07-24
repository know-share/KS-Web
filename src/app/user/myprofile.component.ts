import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//primeng
import {Message} from 'primeng/primeng';

//Services
import { UsuarioService } from '../services/usuario.service';
import { ErrorService } from '../error/error.service';
import { IdeaService } from '../services/idea.service';
import { TagService } from '../services/tag.service';

//Entities
import { Usuario } from '../entities/usuario';
import { Habilidad } from '../entities/habilidad';
import { AreaConocimiento } from '../entities/areaConocimiento';
import { Idea } from '../entities/idea';
import { Tag } from '../entities/tag';

import { EditCarreraModalComponent } from '../modals/edit-carrera.component';
import { AddTGModalComponent } from '../modals/add-tg.component';
import { AddFAModalComponent } from '../modals/add-fa.component';
import { ExpirationModalComponent } from '../modals/expiration.component';
import { EditHabilidadModalComponent } from '../modals/edit-habilidad.component';
import { EditBasisModalComponent } from '../modals/edit-basis.component';

@Component({
    selector: 'myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./user.component.css']
})
export class ProfileComponent implements OnInit {

    @Input() usuario: Usuario;
    activeTab: string;

    habilidadesPersonales: Habilidad[] = [];

    habilidadesProfesionales: Habilidad[] = [];
    habilidadesProfesionalesSeg: Habilidad[] = [];

    areasConocimiento: AreaConocimiento[] = [];
    areasConocimientoSeg: AreaConocimiento[] = [];

    ideas: Array<Idea> = new Array;
    msgs: Message[] = [];

    display: boolean = false;

    tags : Array<Tag> = new Array;
    selectedTags : any[]
    filteredTagsMultiple: any[];

    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;

    showDialog() {
        this.display = true;
    }

    constructor(
        private ideaService: IdeaService,
        private dialogService: DialogService,
        private usuarioService: UsuarioService,
        private router:Router,
        private tagService : TagService
    ) { 
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {
        this.activeTab = 'ideas';
        this.habilidadesPersonales = [];
        this.habilidadesProfesionales = [];
        this.habilidadesProfesionalesSeg = [];
        this.areasConocimiento = [];
        this.areasConocimientoSeg = [];
        this.mapAreasConocimiento(this.usuario.areasConocimiento);
        for (let h of this.usuario.habilidades) {
            if (h.tipo == 'PERSONALES') {
                this.habilidadesPersonales.push(h);
            }
            if (h.tipo == 'PROFESIONALES' && h.carrera == this.usuario.carrera.nombre) {
                this.habilidadesProfesionales.push(h);
            }
            if (this.usuario.segundaCarrera && h.tipo == 'PROFESIONALES' && h.carrera == this.usuario.segundaCarrera.nombre) {
                this.habilidadesProfesionalesSeg.push(h);
            }
        }
        this.ideaService.findByUsuario(localStorage.getItem('user'))
            .subscribe((res : any[])=>{
                this.ideas = res;
            }, error =>{
                console.log('Error' + error);
            });
    }

    mapAreasConocimiento(areasConocimiento: AreaConocimiento[]) {
        this.areasConocimiento = []; this.areasConocimientoSeg = [];
        for (let ac of areasConocimiento) {
            if (ac.carrera == this.usuario.carrera.nombre) {
                this.areasConocimiento.push(ac);
            }
            if (this.usuario.segundaCarrera && ac.carrera == this.usuario.segundaCarrera.nombre) {
                this.areasConocimientoSeg.push(ac);
            }
        }
    }

    moveTab(tab) {
        this.activeTab = tab;
    }

    addTG() {
        let disposable = this.dialogService.addDialog(AddTGModalComponent).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Trabajo de grado agregado.'});
                }
            });
    }

    addFormacion() {
        let disposable = this.dialogService.addDialog(AddFAModalComponent).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Formación académica agregada.'});
                }
            });
    }

    editCarrera(principal) {
        let disposable = this.dialogService.addDialog(EditCarreraModalComponent, {
            usuario: this.usuario,
            isMain: principal
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Información académica fue actualizada.'});
                }
            });
    }

    editBasis(){
        let disposable = this.dialogService.addDialog(EditBasisModalComponent, {
            usuario: this.usuario
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Información personal fue actualizada.'});
                }
            });
    }

    editHabilidadCualidad(){
        let disposable = this.dialogService.addDialog(EditHabilidadModalComponent, {
            usuario: this.usuario
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({severity:'success', summary:'Operación exitosa', detail:'Información fue actualizada.'});
                }
            });
    }

    refreshUsuario() {
        this.usuarioService.getUsuario(localStorage.getItem('user'))
            .subscribe(
            usuario => {
                this.habilidadesPersonales = [];
                this.habilidadesProfesionales = [];
                this.habilidadesProfesionalesSeg = [];
                this.areasConocimiento = [];
                this.areasConocimientoSeg = [];
                this.usuario = usuario;
                this.mapAreasConocimiento(usuario.areasConocimiento);
                for (let h of usuario.habilidades) {
                    if (h.tipo == 'PERSONALES') {
                        this.habilidadesPersonales.push(h);
                    }
                    if (h.tipo == 'PROFESIONALES' && h.carrera == this.usuario.carrera.nombre) {
                        this.habilidadesProfesionales.push(h);
                    }
                    if (this.usuario.segundaCarrera && h.tipo == 'PROFESIONALES' && h.carrera == this.usuario.segundaCarrera.nombre) {
                        this.habilidadesProfesionalesSeg.push(h);
                    }
                }
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            }
            );
    }

    goProfile(username){
        this.router.navigate(['/user',username]);
    }

    eliminarAmigo(username){
        this.usuarioService.eliminarAmigo(username)
            .subscribe(
                ok => this.refreshUsuario()
                ,error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                    else
                        console.log('error: '+error);
                }
            )
    }

    crearIdea() {
        let idea: Idea = new Idea();
        idea.alcance = this.alcance;
        idea.tipo = this.selectedValueTipo;
        idea.contenido = this.contenido;
        idea.numeroEstudiantes = this.numeroEstudiantes;
        idea.problematica = this.problematica;
        idea.tags = this.selectedTags;
        console.log(this.selectedTags);
        console.log(idea);
        this.ideaService.crearIdea(idea)
            .subscribe((res:Idea) => {
                this.ideas.push(res);
                console.log(res.usuario);
            }, error => {
                let disposable;
                if(error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });

        this.selectedTags = new Array;
        this.contenido = '';
        this.alcance = '';
        this.problematica = '';
        this.numeroEstudiantes = 0;
    }

    filterTagMultiple(event) {
        let query = event.query;
        this.tagService.getAllTags().subscribe((tags:Array<Tag>) => {
            this.filteredTagsMultiple = this.filterTag(query, tags);
        });
    }

    filterTag(query, tags: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if(tag.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(tag);
            }
        }
        return filtered;
    }
}