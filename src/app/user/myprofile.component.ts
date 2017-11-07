import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";

//primeng
import { Message } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';

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
import { TrabajoGrado } from './../entities/trabajoGrado';
import { IdeaHome } from './../entities/ideaHome';
import { Page } from '../entities/page';

import { EditCarreraModalComponent } from '../modals/edit-carrera.component';
import { AddTGModalComponent } from '../modals/add-tg.component';
import { AsociarTGModalComponent } from './../modals/asociarTG.component';
import { IdeasProyectoModalComponent } from './../modals/ideasProyecto.component';
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
/**
 * Permite manejar la funcionalidad de la pantalla de perfil de usuario
 */
export class ProfileComponent implements OnInit {

    @ViewChild('profileImage') profileImage: ElementRef;
    serverUri = URL_IMAGE_USER;

    @ViewChild('publishButton') publishButton;

    @Input() usuario: Usuario;
    activeTab: string;

    habilidadesPersonales: Habilidad[] = [];

    habilidadesProfesionales: Habilidad[] = [];
    habilidadesProfesionalesSeg: Habilidad[] = [];

    areasConocimiento: AreaConocimiento[] = [];
    areasConocimientoSeg: AreaConocimiento[] = [];

    idea: Idea = new Idea;
    tg: TrabajoGrado;
    valid: boolean = true;
    ideasPro: Array<Idea> = new Array;
    ideas: Array<Idea> = new Array;
    msgs: Message[] = [];

    role = localStorage.getItem('role');

    display: boolean = false;

    selectedTags: any[] = new Array;
    tags: SelectItem[] = [];

    selectedValueTipo: string;
    contenido: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;

    insgniasNoVistas = 0;

    editLikes: boolean = false;

    errorCrearIdea: string;

    //---------------------------------------------
    //Gustos
    //---------------------------------------------

    activeTabGustos: string = "generales";

    gustosGenerales: Gusto[] = [];
    gustosDeportes: Gusto[] = [];
    gustosArtes: Gusto[] = [];
    gustos: Gusto[] = []; // Just for student

    pageable: Page<Idea> = null;
    timestamp: number;

    help_idea = '';

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
        private lc: NgZone,
    ) {
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
                if (status) {
                    if (this.pageable && !this.pageable.last)
                        this.findIdeas(this.pageable.number + 1);
                }
            });
        };
        this.timestamp = (new Date).getTime();
        this.selectedValueTipo = 'NU';
        this.help_idea = 'Ideas nuevas son ideas que no tienen un soporte académico aún. Se suelen crear de manera espontánea.';
        this.showTags();
    }

    ngOnInit() {
        this.editLikes = false;
        this.activeTab = 'ideas';
        this.habilidadesPersonales = [];
        this.habilidadesProfesionales = [];
        this.habilidadesProfesionalesSeg = [];
        this.areasConocimiento = [];
        this.ideas = new Array;
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
        this.findIdeas(0);
        this.reloadImage();
        this.totalInsigniasNoVistas();
    }
    /**
     * Busca las ideas del usuario.
     * @param page numero de pagina
     */
    findIdeas(page) {
        this.ideaService.findByUsuario(localStorage.getItem('user'),page,this.timestamp)
            .subscribe((res: Page<Idea>) => {
                this.pageable = res;
                this.ideas = this.ideas.concat(this.pageable.content);
            }, error => {
                console.log('Error' + error);
            });
    }

    /**
     * Calcula el total de las insignias ganadas por el usuario
     * pero que aun no ha visto
     */
    totalInsigniasNoVistas() {
        let total = 0;
        for (let ins of this.usuario.insignias)
            if (!ins.visto)
                total += 1;
        this.insgniasNoVistas = total;
    }

    /**
     * Muestra las areas de conocimiento del usuario.
     * @param areasConocimiento areas de conocimiento
     */
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

    /**
     * Carga la imagen que el usuario selecciono en el registro,
     * si no selecciono ninguna carga la imagen por defecto.
     */
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
     * Permite moverse entre pestañas
     * @param tab pestaña destino
     */
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

    /**
     * Abre el modal para agregar un trabajo de grado
     * a una idea para continuar
     */
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

    /**
     * Abre el modal para agregar la informacion academica
     * del usuario
     */
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

    /**
     * Abre el modal para editar la carrera
     * del usuario
     */
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

    /**
     * Abre el modal para editar la informacion basica
     * del usuario
     */
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

    /**
     * Abre el modal para editar la las habilidades y cualidades
     * del usuario
     */    
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

    /**
     * Actualiza la informacion del usuario
     */
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

    /**
     * Permite ir al perfil de un usuario
     * especifico.
     * @param username perfil del otro usuario
     */
    goProfile(username) {
        this.router.navigate(['/user', username]);
    }

    /**
     * Permite a un usuario eliminar de su lista de amigos a otro usuario
     * @param username usuario que se va a eliminar de la lista de amigos
     */
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
            if (this.contenido &&  this.tg) {
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
            if (this.contenido  && this.alcance && this.problematica) {
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
            if (this.contenido &&  this.ideasPro.length > 0) {
                this.crearIdeaNorm();
            } else {
                this.valid = false;
                this.errorCrearIdea = 'Por favor, completar todos los campos.';
            }
    }

    /**
     * Limpia el formulario despues de crear una idea.
     */
    cleanFormIdea() {
        this.publishButton.nativeElement.disabled = false;
        this.contenido = '';
        this.numeroEstudiantes = 0;
        this.alcance = '';
        this.problematica = '';
        this.selectedTags = [];
        this.ideasPro = [];
    }

    /**
     * Crea la idea con la informacion suministrada
     * por el usuario.
     */
    crearIdeaNorm() {
        this.publishButton.nativeElement.disabled = true;
        let temp: Array<Idea> = new Array;
        this.valid = true;
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
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Idea publicada', detail: 'Tu idea ha sido publicada exitosamente.' });
                this.ideas.splice(0, 0, res);
                this.cleanFormIdea();
            }, error => {
                let disposable;
                if (error == 'Error: 401')
                    disposable = this.dialogService.addDialog(ExpirationModalComponent);
            });
    }

    /**
     * Abre el modal para agregar ideas a una idea 
     * de tipo proyecto
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
     * Abre el modal para agregar un trabajo de grado 
     * a una idea para continuar
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
     * Permite ir a la pagina de busqueda
     */
    search() {
        this.router.navigate(['/search']);
    }

    /**
     * Abre el modal para seleccionar una imagen para el
     * perfil de usuario.
     */
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
     * Permite a un usuario eliminar su carrera.
     */
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

    /**
     * Actualiza el estado de una idea
     * @param confirm nuevo estado de la idea
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
                })
        } else {
            //pop up con error
        }
    }

    // gustos
    /**
     * Agrega o elimina determinado gusto
     * @param object gusto a agregar o eliminar
     */
    checkGusto(object) {
        if (this.gustos.find(obj => obj.id == object.id) == null)
            this.gustos.push(object);
        else
            this.gustos = this.gustos.filter(obj => obj.id != object.id);
    }

    /**
     * Verifica un item en una lista.
     * @param item item a verificar
     * @param list lista para verificar
     */
    isCheckWithId(item, list) {
        return list.find(obj => obj.id == item.id) == null ? false : true;
    }

    /**
     * Permite navegar entre las pestañas
     * @param location 
     * @param where 
     */
    goTo(location, where) {
        if (where == 'gustos')
            this.activeTabGustos = location;
    }

    /**
     * Pone el atributo de likes editados en verdadero
     */
    setEditLikes() {
        this.editLikes = true;
    }

    /**
     * Guarda los gustos del usuario.
     */
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

    /**
     * Permite promover un usuario de estudiante a egresado.
     */
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

    /**
     * Brinda informacion de los tipos de idea.
     */
    onChangeTipoIdea(){
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
