import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpValidation } from '../utils/signup.validation';

import { Subscription } from 'rxjs';

//Entities
import { Personalidad } from '../entities/personalidad';
import { Carrera } from '../entities/carrera';
import { Gusto } from '../entities/gusto';
import { Habilidad } from '../entities/habilidad';
import { Cualidad } from '../entities/cualidad';
import { Enfasis } from '../entities/enfasis';
import { AreaConocimiento } from '../entities/areaConocimiento';
import { Usuario } from '../entities/usuario';
import { Auth } from '../entities/auth';

//Services
import { PersonalidadService } from '../services/personalidad.service';
import { CarreraService } from '../services/carrera.service';
import { GustoService } from '../services/gusto.service';
import { HabilidadService } from '../services/habilidad.service';
import { UsuarioService } from '../services/usuario.service';
import { CualidadService } from '../services/cualidad.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
/**
 * Componente que maneja las diferentes pestañas
 * para el registro a la aplicacion.
 */
export class SignUpComponent implements OnInit {

    currentStep: number;
    activeTabGustos: string;
    activeTabEnfasis: string;
    activeTabHabilidades: string;
    activeTabCualidades: string;

    //Formgroups
    stepOneForm: FormGroup;

    //Info retrieve of server
    personalidades: Personalidad[] = [];
    carreras: Carrera[] = [];
    copyCarreras: Carrera[] = [];
    gustosGenerales: Gusto[] = [];
    gustosDeportes: Gusto[] = [];
    gustosArtes: Gusto[] = [];
    enfasisCarrera: Enfasis[] = [];
    copyEnfasisCarrera: Enfasis[] = [];
    enfasisSegundaCarrera: Enfasis[] = [];
    copyEnfasisSegundaCarrera: Enfasis[] = [];
    ACCarrera: AreaConocimiento[] = [];
    ACSegundaCarrera: AreaConocimiento[] = [];
    habilidadesPersonales: Habilidad[] = [];
    habilidadProfesionalesPrimera: Habilidad[] = [];
    habilidadProfesionalesSegunda: Habilidad[] = [];
    cualidades: Cualidad[] = [];

    //Step 1
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    username: string;
    gender: string;

    //Step 2 attributes
    tipoUsuario: string;
    carrera: Carrera;
    segundaCarrera: Carrera;
    semestre: number;
    seminario: any;
    temaTG: boolean;
    grupoInvestigacion: string = "";

    //Step 3 attributes
    personalidad: Personalidad;

    //Step 4 attributes
    gustos: Gusto[] = []; // Just for student

    //Step 5 attributes.
    //Step 4 attributes For profesor and egresado
    enfasisPrincipal: Enfasis;
    enfasisSecundario: Enfasis;
    enfasisPrincipalSegundaCarrera: Enfasis;
    enfasisSecundarioSegundaCarrera: Enfasis;
    ACSelected: AreaConocimiento[] = []; // profesor with percentage
    ACSelectedSegunda: AreaConocimiento[] = [];

    //Step 6 attributes
    //Step 5 attributes for profesor and egresado
    habilidadesPerSelected: Habilidad[] = [];
    habilidadesProSelected: Habilidad[] = [];
    habilidadesProSegSelected: Habilidad[] = [];
    cualidadesProfesor: Cualidad[] = []; // Just for profesor

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private personalidadService: PersonalidadService,
        private carreraService: CarreraService,
        private gustoService: GustoService,
        private habilidadService: HabilidadService,
        private usuarioService: UsuarioService,
        private cualidadService: CualidadService,
        private authService: AuthService,
    ) {
        this.gender="Femenino";
        this.activeTabGustos = 'generales';
        this.activeTabEnfasis = 'enfasis';
        this.activeTabHabilidades = 'personales';
        this.activeTabCualidades = 'profesor';

        this.enfasisSecundario = null;
        this.enfasisSecundarioSegundaCarrera = null;
        this.tipoUsuario = "ESTUDIANTE";
        this.segundaCarrera = null;
        this.semestre = 1;
        this.currentStep = 1;
        this.seminario = false;
        this.temaTG = false;
        this.personalidadService.getAllPersonalidades()
            .subscribe(
            personalidades => {
                this.personalidades = personalidades;
            },
            error => console.log("error: " + error)
            );

        this.carreraService.getAllCarreras()
            .subscribe(
            carreras => {
                this.carreras = carreras;
                this.carrera = this.carreras[0];
                this.copyCarreras = this.carreras.filter(c => c.id != this.carrera.id);
            },
            error => console.log("error: " + error)
            );
    }

    ngOnInit() {
        //reset all
        this.ACSelected = [];
        this.ACSelectedSegunda = [];

        //Step 6 attributes
        //Step 5 attributes for profesor and egresado
        this.habilidadesPerSelected = [];
        this.habilidadesProSelected = [];
        this.habilidadesProSegSelected = [];
        this.cualidadesProfesor = [];

        this.stepOneForm = this.fb.group({
            password: ['', Validators.compose([Validators.required,
                //(?=.*?[a-z])(?=.*?[ "/\(\)+=¿¡{|}[+\',.:;<=>`°¬@_~#?!@$%^&*-])
            Validators.pattern('^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$')])],
            email: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]+([.\-_][0-9a-zA-Z]+)*@[0-9a-zA-Z]+(\.[a-zA-Z]+)+$/i)]],
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            username: ['', Validators.compose([Validators.required,Validators.pattern(/^[a-zA-Z0-9\.\-_]{4,}$/)])]
        }, {
                validator: SignUpValidation.Validate // UsernameValidation.UsernameTaken
            });
    }
    /**
     * Verifica que la informacion requerida en el
     * paso 1 este completa para el registro.
     */
    verifyStep1() {
        this.usuarioService.isCorreoTaken(this.email)
            .subscribe(
            taken => {
                if (taken)
                    this.stepOneForm.get("email").setErrors({ CorreoTaken: true });
                else {
                    this.usuarioService.isUsernameTaken(this.username)
                        .subscribe(
                        taken => {
                            if (taken)
                                this.stepOneForm.get("username").setErrors({ UsernameTaken: true });
                            else 
                                this.currentStep = 2;
                        });
                }
            });

    }
    /**
     * Verifica que la informacion requerida en el
     * paso 2 este completa para el registro.
     */
    verifyStep2() {
        this.gustosGenerales = []; this.gustosDeportes = []; this.gustosArtes = [];
        if (this.tipoUsuario == 'ESTUDIANTE') {
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
                    }
                },
                error => console.log('error: ' + error)
                );
        }
        this.enfasisCarrera = []; this.ACCarrera = [];
        this.carreraService.getEnfasisAreaConocimiento(this.carrera.id)
            .subscribe(
            enfasisAC => {
                for (let e of enfasisAC.enfasis) {
                    let enf: Enfasis = new Enfasis();
                    enf.carrera = this.carrera.id;
                    enf.nombre = e;
                    this.enfasisCarrera.push(enf);
                }
                for (let ac of enfasisAC.areaConocimiento) {
                    let acono: AreaConocimiento = new AreaConocimiento();
                    acono.carrera = this.carrera.id;
                    acono.nombre = ac;
                    acono.porcentaje = 0;
                    this.ACCarrera.push(acono);
                }

                this.enfasisPrincipal = this.enfasisCarrera[0];
                this.copyEnfasisCarrera = this.enfasisCarrera.filter(e => e.nombre != this.enfasisPrincipal.nombre);
            }, error => console.log('error: ' + error)
            );
        if (this.segundaCarrera != null) {
            this.ACSegundaCarrera = []; this.enfasisSegundaCarrera = [];
            this.carreraService.getEnfasisAreaConocimiento(this.segundaCarrera.id)
                .subscribe(
                enfasisAC => {
                    for (let e of enfasisAC.enfasis) {
                        let enf: Enfasis = new Enfasis();
                        enf.carrera = this.segundaCarrera.id;
                        enf.nombre = e;
                        this.enfasisSegundaCarrera.push(enf);
                    }
                    for (let ac of enfasisAC.areaConocimiento) {
                        let acono: AreaConocimiento = new AreaConocimiento();
                        acono.carrera = this.segundaCarrera.id;
                        acono.nombre = ac;
                        acono.porcentaje = 0;
                        this.ACSegundaCarrera.push(acono);
                    }

                    this.enfasisPrincipalSegundaCarrera = this.enfasisSegundaCarrera[0];
                    this.copyEnfasisSegundaCarrera = this.enfasisSegundaCarrera
                        .filter(e => e.nombre != this.enfasisPrincipalSegundaCarrera.nombre);
                }, error => console.log('error: ' + error)
                );
        }
        this.currentStep = 3;
    }

    /**
     * Verifica que la informacion requerida en el
     * paso 3 este completa para el registro y asigna
     * la personalidad del usuario.
     * @param p personalidad seleccionada
     */
    verifyStep3(p: Personalidad) {
        this.habilidadProfesionalesPrimera = [];
        this.habilidadProfesionalesSegunda = [];
        this.habilidadesPersonales = [];
        if (this.habilidadesPersonales.length == 0 && this.habilidadProfesionalesPrimera.length == 0) {
            this.habilidadService.getHabilidades(this.carrera.id)
                .subscribe(
                habilidades => {
                    for (let habilidad of habilidades) {
                        if (habilidad.tipo == 'PERSONALES')
                            this.habilidadesPersonales.push(habilidad);
                        if (habilidad.tipo == 'PROFESIONALES')
                            this.habilidadProfesionalesPrimera.push(habilidad);
                    }
                }, error => console.log('error: ' + error)
                );
        }
        if (this.segundaCarrera && this.habilidadProfesionalesSegunda.length == 0) {
            this.habilidadService.getHabilidadesProfesionales(this.segundaCarrera.id)
                .subscribe(
                habilidades => {
                    this.habilidadProfesionalesSegunda = habilidades;
                }, error => console.log('error: ' + error)
                );
        }

        if (this.tipoUsuario == "PROFESOR" && this.cualidades.length == 0) {
            this.cualidadService.getAllCualidades()
                .subscribe(
                cualidades => this.cualidades = cualidades,
                error => console.log('error: ' + error)
                );
        }

        this.personalidad = p;
        this.currentStep = 4;
    }

    /**
     * Avanza al siguiente paso dependiendo del 
     * tipo de usuario.
     */
    next() {
        //this.currentStep += 1;
        if (this.tipoUsuario == "ESTUDIANTE") {
            if (this.currentStep == 4) {
                if (this.activeTabGustos == "generales")
                    this.activeTabGustos = "deportes";
                else
                    if (this.activeTabGustos == "deportes")
                        this.activeTabGustos = "artes";
                    else
                        if (this.activeTabGustos == "artes")
                            this.currentStep += 1;
                return;
            }
            if (this.currentStep == 5) {
                if (this.activeTabEnfasis == "enfasis")
                    this.activeTabEnfasis = "ac";
                else
                    this.currentStep += 1;
                return;
            }
        }
        if (this.tipoUsuario != "ESTUDIANTE") {
            if (this.currentStep == 4) {
                if (this.activeTabEnfasis == "enfasis")
                    this.activeTabEnfasis = "ac";
                else
                    this.currentStep += 1;
                return;
            }
        }
        this.currentStep += 1;
    }

    /**
     * Agrega o elimina a la lista list elementos
     * marcados por id.
     * @param item item a agregar o eliminar
     * @param list lista a la que se agrean los items 
     */
    isCheckWithId(item, list) {
        return list.find(obj => obj.id == item.id) == null ? false : true;
    }

    /**
     * Agrega o elimina a la lista list elementos
     * marcados por nombre. 
     * @param item item a agregar o eliminar
     * @param list lista a la que se agrean los items
     */
    isCheckWithName(item, list) {
        return list.find(obj => obj.nombre == item.nombre) == null ? false : true;
    }

    /**
     * Agrega o elimina a la lista de gustos
     * un gusto seleccionado.
     * @param object gusto a agregar o eliminar
     */
    checkGusto(object) {
        if (this.gustos.find(obj => obj.id == object.id) == null)
            this.gustos.push(object);
        else
            this.gustos = this.gustos.filter(obj => obj.id != object.id);
    }

    /**
     * Agrega o elimina a la lista de areas de conocimiento
     * principales un area de conocimiento
     * @param ac area de conocimiento a agregar o eliminar
     */
    checkACPrincipal(ac) {
        if (this.ACSelected.find(obj => obj == ac) == null)
            this.ACSelected.push(ac);
        else
            this.ACSelected = this.ACSelected.filter(obj => obj != ac);
    }

    /**
     * Agrega o elimina a la lista de areas de conocimiento
     * secundarias un area de conocimiento
     * @param ac area de conocimiento a agregar o eliminar
     */
    checkACSecundario(ac) {
        if (this.ACSelectedSegunda.find(obj => obj == ac) == null)
            this.ACSelectedSegunda.push(ac);
        else
            this.ACSelectedSegunda = this.ACSelectedSegunda.filter(obj => obj != ac);
    }

    /**
     * Agrega o elimina una habilidad personal
     * a una lista de habilidades
     * @param h habilidad personal a agregar o eliminar
     */
    checkHabilidadesPerSelected(h) {
        if (this.habilidadesPerSelected.find(obj => obj == h) == null)
            this.habilidadesPerSelected.push(h);
        else
            this.habilidadesPerSelected = this.habilidadesPerSelected.filter(obj => obj != h);
    }

    /**
     * Agrega o elimina una habilidade profesional
     * a una lista de habilidades
     * @param h habilidad personal a agregar o eliminar
     */ 
    checkHabilidadesProSelected(h) {
        if (this.habilidadesProSelected.find(obj => obj == h) == null)
            this.habilidadesProSelected.push(h);
        else
            this.habilidadesProSelected = this.habilidadesProSelected.filter(obj => obj != h);
    }

    /**
     * Agrega o elimina una habilidad profesional secundaria
     * a una lista de habilidades
     * @param h habilidad personal a agregar o eliminar
     */
    checkHabilidadesProSegSelected(h) {
        if (this.habilidadesProSegSelected.find(obj => obj == h) == null)
            this.habilidadesProSegSelected.push(h);
        else
            this.habilidadesProSegSelected = this.habilidadesProSegSelected.filter(obj => obj != h);
    }

    /**
     * Agrega o elimina una habilidad profesional secundaria
     * a una lista de habilidades
     * @param c habilidad personal a agregar o eliminar
     */
    checkCualidadesProfesor(c) {
        if (this.cualidadesProfesor.find(obj => obj == c) == null)
            this.cualidadesProfesor.push(c);
        else
            this.cualidadesProfesor = this.cualidadesProfesor.filter(obj => obj != c);
    }

    /**
     * Regista el usuario en el sistema
     */
    sendRequestSignUp() {
        if ((this.currentStep == 6 || (this.tipoUsuario == "EGRESADO" && this.currentStep == 5))
            && this.activeTabHabilidades == "personales") {
            this.activeTabHabilidades = "profesionales";
            return;
        } else {
            if (this.tipoUsuario == "PROFESOR" && this.activeTabCualidades == "profesor") {
                this.activeTabCualidades = "profesional";
                return;
            }
        }
        let usuario = new Usuario();
        usuario.nombre = this.nombre;
        usuario.apellido = this.apellido;
        usuario.email = this.email;
        usuario.password = this.password;
        usuario.username = this.username;
        usuario.genero = this.gender;
        usuario.disponible = true;

        //Step 2 attributes
        usuario.tipoUsuario = this.tipoUsuario;
        usuario.carrera = this.carrera;
        usuario.segundaCarrera = this.segundaCarrera;
        usuario.semestre = this.semestre;
        usuario.seminario = this.seminario;
        usuario.temaTG = this.temaTG;
        if(this.tipoUsuario == 'PROFESOR')
            usuario.grupoInvestigacion = this.grupoInvestigacion;

        //Step 3 attributes 
        usuario.personalidad = this.personalidad;

        //Step 4 attributes
        usuario.gustos = this.gustos;

        //Step 5 attributes.
        //Step 4 attributes For profesor and egresado
        let enfasisList: Enfasis[] = [];
        enfasisList.push(this.enfasisPrincipal);
        enfasisList.push(this.enfasisSecundario);
        if (this.segundaCarrera) {
            enfasisList.push(this.enfasisPrincipalSegundaCarrera);
            enfasisList.push(this.enfasisSecundarioSegundaCarrera);
        }
        usuario.enfasis = enfasisList;

        if (this.segundaCarrera)
            usuario.areasConocimiento = this.ACSelected.concat(this.ACSelectedSegunda);
        else
            usuario.areasConocimiento = this.ACSelected;

        //Step 6 attributes
        //Step 5 attributes for profesor and egresado
        usuario.habilidades = this.habilidadesPerSelected.concat(this.habilidadesProSelected,
            this.habilidadesProSegSelected);
        usuario.cualidades = this.cualidadesProfesor;

        this.usuarioService.crearUsuario(usuario)
            .subscribe(
            res => {
                let auth: Auth = new Auth();
                auth.password = usuario.password;
                auth.username = usuario.username;
                this.authService.login(auth)
                    .subscribe(res => {
                        localStorage.setItem('user', auth.username);
                        localStorage.setItem('token', res.token);
                        localStorage.setItem('role',res.role);
                        this.router.navigate(['/home']);
                    }, error => {
                        console.log('Error: ' + error);
                    });
            }, error => console.log('error: ' + error)
            );
    }

    /**
     * Navega entre pestañas del registro
     * @param location nueva pestaña
     * @param where pestaña actual
     */
    goTo(location, where) {
        if (where == 'enfasis')
            this.activeTabEnfasis = location;
        if (where == 'gustos')
            this.activeTabGustos = location;
        if (where == 'habilidades') {
            this.activeTabHabilidades = location;
        }
        if (where == 'cualidades') {
            this.activeTabCualidades = location;
        }
    }

    /**
     * Hace una copia de las carreras con excepcion
     * de la seleccionada.
     * @param event 
     */
    updateCopyCarreras(event){
        if(this.segundaCarrera && this.carrera.id == this.segundaCarrera.id)
            this.segundaCarrera = null;
        this.copyCarreras = this.carreras.filter(c => c.id != this.carrera.id);
    }

    /**
     * Hace una copia de los enfasis
     * @param event 
     */
    updateCopyEnfasis(event){
        if(this.enfasisSecundario && this.enfasisPrincipal.nombre == this.enfasisSecundario.nombre)
            this.enfasisSecundario = null;
        this.copyEnfasisCarrera = this.enfasisCarrera.filter(e => e.nombre != this.enfasisPrincipal.nombre);
    }

    /**
     * Hace una copia de los enfasis secundarios
     * @param event 
     */
    updateCopySegundoEnfasis(event){
        if(this.enfasisSecundarioSegundaCarrera && 
            this.enfasisPrincipalSegundaCarrera.nombre == this.enfasisSecundarioSegundaCarrera.nombre)
            this.enfasisSecundarioSegundaCarrera = null;
        this.copyEnfasisSegundaCarrera = this.enfasisSegundaCarrera
            .filter(e => e.nombre != this.enfasisPrincipalSegundaCarrera.nombre);
    }
}