import { AsociarTGModalComponent } from './../modals/asociarTG.component';
import { IdeasProyectoModalComponent } from './../modals/ideasProyecto.component';
import { TrabajoGrado } from './../entities/trabajoGrado';
import { IdeaHome } from './../entities/ideaHome';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";

//primeng
import { Message } from 'primeng/primeng';

//Services
import { UsuarioService } from '../services/usuario.service';
import { ErrorService } from '../error/error.service';
import { IdeaService } from '../services/idea.service';
import { TagService } from '../services/tag.service';
import { GustoService } from '../services/gusto.service';

//Entities
import { Usuario } from '../entities/usuario';
import { Habilidad } from '../entities/habilidad';
import { AreaConocimiento } from '../entities/areaConocimiento';
import { Idea } from '../entities/idea';
import { Tag } from '../entities/tag';
import { URL_IMAGE_USER } from '../entities/constants';
import { Enfasis } from '../entities/enfasis';
import { Gusto } from '../entities/gusto';

import { EditCarreraModalComponent } from '../modals/edit-carrera.component';
import { AddTGModalComponent } from '../modals/add-tg.component';
import { AddFAModalComponent } from '../modals/add-fa.component';
import { ExpirationModalComponent } from '../modals/expiration.component';
import { EditHabilidadModalComponent } from '../modals/edit-habilidad.component';
import { EditBasisModalComponent } from '../modals/edit-basis.component';
import { UploadImageModalComponent } from '../modals/upload-image.component';

@Component({
    selector: 'myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./user.component.css']
})
export class ProfileComponent implements OnInit {

    @ViewChild('profileImage') profileImage: ElementRef;
    serverUri = URL_IMAGE_USER;

    @Input() usuario: Usuario;
    activeTab: string;

    habilidadesPersonales: Habilidad[] = [];

    habilidadesProfesionales: Habilidad[] = [];
    habilidadesProfesionalesSeg: Habilidad[] = [];

    areasConocimiento: AreaConocimiento[] = [];
    areasConocimientoSeg: AreaConocimiento[] = [];

    idea: Idea = new Idea;
    tg: TrabajoGrado = new TrabajoGrado();
    valid: boolean = true;
    ideasPro: Array<Idea> = new Array;
    ideas: Array<Idea> = new Array;
    msgs: Message[] = [];

    display: boolean = false;

    tags: Array<Tag> = new Array;
    selectedTags: any[]
    filteredTagsMultiple: any[];
    

    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;

    insgniasNoVistas = 0;

    editLikes: boolean = false;

    //---------------------------------------------
    //Gustos
    //---------------------------------------------

    activeTabGustos: string = "generales";

    gustosGenerales: Gusto[] = [];
    gustosDeportes: Gusto[] = [];
    gustosArtes: Gusto[] = [];
    gustos: Gusto[] = []; // Just for student

    showDialog() {
        this.display = true;
    }

    constructor(
        private ideaService: IdeaService,
        private dialogService: DialogService,
        private usuarioService: UsuarioService,
        private router: Router,
        private tagService: TagService,
        private gustoService: GustoService,
    ) {
        this.selectedValueTipo = 'NU';
    }

    ngOnInit() {
        this.editLikes = false;
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
            .subscribe((res: any[]) => {
                this.ideas = res;
            }, error => {
                console.log('Error' + error);
            });
        this.reloadImage();
        this.totalInsigniasNoVistas();
    }

    totalInsigniasNoVistas() {
        let total = 0;
        for (let ins of this.usuario.insignias)
            if (!ins.visto)
                total += 1;
        this.insgniasNoVistas = total;
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

    reloadImage() {
        if (this.usuario.imagen) {
            this.profileImage.nativeElement.src = URL_IMAGE_USER + this.usuario.username + "?" + new Date().getTime();
        } else {
            if (this.usuario.genero == 'Femenino')
                this.profileImage.nativeElement.src = "images/icons/woman.png";
            else
                this.profileImage.nativeElement.src = "images/icons/dude4_x128.png";
        }
    }

    moveTab(tab) {
        this.editLikes = false;
        this.activeTab = tab;
        if (this.activeTab == 'badges' && this.insgniasNoVistas > 0) {
            this.usuarioService.updateInsignias()
                .subscribe(
                ok => setTimeout(() => this.insgniasNoVistas = 0, 2000)
                , error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                });
        }
        if (this.activeTab == 'likes') {
            this.gustos = [];
            this.gustosArtes = [];
            this.gustosDeportes = [];
            this.gustosGenerales = [];
            this.gustoService.getAllGustos()
                .subscribe(
                gustos => {
                    for (let gusto of gustos) {
                        if (gusto.tipo == 'GENERALES')
                            this.gustosGenerales.push(gusto);
                        if (gusto.tipo == 'ARTES')
                            this.gustosArtes.push(gusto);
                        if (gusto.tipo == 'DEPORTES')
                            this.gustosDeportes.push(gusto);
                        if (this.usuario.gustos.find(g => g.imagePath == gusto.imagePath) != null)
                            this.gustos.push(gusto);
                    }
                }, error => console.log('error: ' + error));
        }
    }

    addTG() {
        let disposable = this.dialogService.addDialog(AddTGModalComponent).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Trabajo de grado agregado.' });
                }
            });
    }

    addFormacion() {
        let disposable = this.dialogService.addDialog(AddFAModalComponent).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Formación académica agregada.' });
                }
            });
    }

    editCarrera(principal, isNew) {
        let disposable = this.dialogService.addDialog(EditCarreraModalComponent, {
            usuario: this.usuario,
            isMain: principal,
            isNew: isNew
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Información académica fue actualizada.' });
                }
            });
    }

    editBasis() {
        let disposable = this.dialogService.addDialog(EditBasisModalComponent, {
            usuario: this.usuario
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Información personal fue actualizada.' });
                }
            });
    }

    editHabilidadCualidad() {
        let disposable = this.dialogService.addDialog(EditHabilidadModalComponent, {
            usuario: this.usuario
        }).subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Información fue actualizada.' });
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
                this.reloadImage();
                this.totalInsigniasNoVistas();
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    goProfile(username) {
        this.router.navigate(['/user', username]);
    }

    eliminarAmigo(username) {
        this.usuarioService.eliminarAmigo(username)
            .subscribe(
            ok => this.refreshUsuario()
            , error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    console.log('error: ' + error);
            }
            )
    }

    crearIdea() {
        console.log(this.tg);
        if (this.contenido != undefined && this.selectedValueTipo == "NU" && this.selectedTags.length > 0) {
            this.crearIdeaNorm();
        } else {
            this.valid = false;
        }
        if (this.contenido != undefined && this.selectedValueTipo == "PC" && this.selectedTags.length > 0 &&
            this.numeroEstudiantes > 0 && this.tg != undefined) {
            this.crearIdeaNorm();
        } else {
            this.valid = false;
        }
        if (this.contenido != undefined && this.selectedValueTipo == "PE" && this.selectedTags.length > 0 &&
            this.numeroEstudiantes > 0 && this.alcance != undefined && this.problematica != undefined) {
            this.crearIdeaNorm();
        } else {
            this.valid = false;
        }
        if (this.contenido != undefined && this.selectedValueTipo == "PR" && this.selectedTags.length > 0 &&
            this.ideasPro.length > 0) {
            this.crearIdeaNorm();
        } else {
            this.valid = false;
        }
    }

    crearIdeaNorm() {
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
                this.ideas.push(res);
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    agregarIdeas() {
        let disposable = this.dialogService.addDialog(IdeasProyectoModalComponent, {})
            .subscribe(confirmed => {
                if (confirmed) {
                    this.ideasPro = confirmed;
                } else {
                }
            });
    }

    asociarTG() {
        let disposable = this.dialogService.addDialog(AsociarTGModalComponent, {})
            .subscribe(confirmed => {
                if (confirmed) {
                    this.tg = confirmed;
                } else {
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

    search() {
        this.router.navigate(['/search']);
    }

    uploadImage() {
        let disposable = this.dialogService.addDialog(UploadImageModalComponent)
            .subscribe(
            confirmed => {
                if (confirmed) {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Imagen de perfil actualizada.' });
                }
            });
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

    eliminarCarrera() {
        let dto: Usuario = new Usuario();
        dto.id = this.usuario.id;
        dto.tipoUsuario = this.usuario.tipoUsuario;
        dto.carrera = this.usuario.carrera;
        dto.segundaCarrera = null;

        dto.enfasis = new Array<Enfasis>();
        dto.enfasis.push(this.usuario.enfasis[0]);
        dto.enfasis.push(this.usuario.enfasis[1]);

        dto.areasConocimiento = this.usuario.areasConocimiento.filter(a => a.carrera == this.usuario.carrera.nombre);
        dto.habilidades = this.usuario.habilidades.filter(h => h.carrera == this.usuario.carrera.nombre || h.tipo == 'PERSONALES');

        this.usuarioService.actualizarInfoAcademica(dto)
            .subscribe(
            ok => {
                if (ok == 'ok') {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Información académica fue actualizada.' });
                }
            }
            , error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
                else
                    console.log('error: ' + error);
            }
            );
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
                })
        } else {
            //pop up con error
        }
    }

    // gustos

    checkGusto(object) {
        if (this.gustos.find(obj => obj.id == object.id) == null)
            this.gustos.push(object);
        else
            this.gustos = this.gustos.filter(obj => obj.id != object.id);
    }

    isCheckWithId(item, list) {
        return list.find(obj => obj.id == item.id) == null ? false : true;
    }

    goTo(location, where) {
        if (where == 'gustos')
            this.activeTabGustos = location;
    }

    setEditLikes() {
        this.editLikes = true;
    }

    saveLikes() {
        if (this.gustos.length == 0) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'No hay gustos seleccionados', detail: 'Debe seleccionar al menos un gusto.' });
        } else {
            this.editLikes = false;
            this.usuarioService.actualizarGustos(this.gustos)
                .subscribe(
                ok => {
                    this.refreshUsuario();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Operación exitosa', detail: 'Gustos actualizados.' });
                }, error => {
                    let disposable;
                    if (error == 'Error: 401')
                        disposable = this.dialogService.addDialog(ExpirationModalComponent);
                }
                )
        }
    }

    promote() {
        this.usuarioService.promote(this.usuario.username)
            .subscribe(
            ok => this.refreshUsuario(),
            error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }
}
