import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpValidation } from '../utils/signup.validation';

//Entities
import { Personalidad } from '../entities/personalidad';
import { Carrera } from '../entities/carrera';
import { Gusto } from '../entities/gusto';
import { Habilidad } from '../entities/habilidad';

//Services
import { PersonalidadService } from '../services/personalidad.service';
import { CarreraService } from '../services/carrera.service';
import { GustoService } from '../services/gusto.service';
import { HabilidadService } from '../services/habilidad.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
    moduleId: module.id,
    selector: 'signup',
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})
export class SignUpComponent implements OnInit {

    currentStep: number;

    //Step 1
    password: string;
    username: string;

    //Formgroups
    stepOneForm: FormGroup;

    //Info retrieve of server
    personalidades: Personalidad[];
    carreras: Carrera[];
    gustosGenerales: Gusto[] = [];
    gustosDeportes: Gusto[] = [];
    gustosArtes: Gusto[] = [];
    enfasisCarrera: string[] = [];
    enfasisSegundaCarrera: string[] = [];
    ACCarrera: string[] = [];
    ACSegundaCarrera: string[] = [];
    habilidadesPersonales: Habilidad[] = [];
    habilidadProfesionalesPrimera: Habilidad[] = []
    habilidadProfesionalesSegunda: Habilidad[] = []

    //Step 2 attributes
    carrera: Carrera;
    segundaCarrera: Carrera;
    tipoUsuario: string;
    semestre: number;
    seminario: boolean;
    temaTG: boolean;

    //Step 3 attributes
    personalidad: Personalidad;

    //Step 4 attributes
    gustos: Gusto[] = []; // student

    //Step 5 attributes
    enfasisPrincipal: string;
    enfasisSecundario: string;
    enfasisPrincipalSegundaCarrera: string;
    enfasisSecundarioSegundaCarrera: string;
    ACSelected: string[] = [];
    ACSelectedSegunda: string[] = [];

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private personalidadService: PersonalidadService,
        private carreraService: CarreraService,
        private gustoService: GustoService,
        private habilidadService: HabilidadService,
        private usuarioService: UsuarioService
    ) {
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
            },
            error => console.log("error: " + error)
            );
    }

    ngOnInit() {
        this.stepOneForm = this.fb.group({
            password: ['', Validators.compose([Validators.required,
                Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])],
            email: ['', [Validators.required, Validators.pattern(/^[0-9]*[a-zA-Z]+([a-zA-Z]*[0-9]*)*@[0-9]*[a-zA-Z]+([a-zA-Z]*[0-9]*)*(\.[a-zA-Z]+)+$/i)]],
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            username: ['', Validators.required]
        }, {
                validator: SignUpValidation.Validate // UsernameValidation.UsernameTaken
            });
    }

    verifyStep1() {
        this.usuarioService.isUsernameTaken(this.username)
            .subscribe(
            taken => {
                if (taken)
                    this.stepOneForm.get("username").setErrors({ UsernameTaken: true });
            }, error => null);
        //this.currentStep = 2;
    }

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
        this.carreraService.getEnfasisAreaConocimiento(this.carrera.nombre)
            .subscribe(
            enfasisAC => {
                this.enfasisCarrera = enfasisAC.enfasis;
                if (enfasisAC.areaConocimiento == null)
                    this.ACCarrera = enfasisAC.enfasis;
                else
                    this.ACCarrera = enfasisAC.areaConocimiento;
                this.enfasisPrincipal = this.enfasisCarrera[0];
            }, error => console.log('error: ' + error)
            );
        if (this.segundaCarrera != null) {
            this.carreraService.getEnfasisAreaConocimiento(this.segundaCarrera.nombre)
                .subscribe(
                enfasisAC => {
                    this.enfasisSegundaCarrera = enfasisAC.enfasis;
                    if (enfasisAC.areaConocimiento == null)
                        this.ACSegundaCarrera = enfasisAC.enfasis;
                    else
                        this.ACSegundaCarrera = enfasisAC.areaConocimiento;
                    this.enfasisPrincipalSegundaCarrera = this.enfasisSegundaCarrera[0];
                }, error => console.log('error: ' + error)
                );
        }
        this.currentStep = 3;
    }

    verifyStep3(p: Personalidad) {
        this.habilidadService.getHabilidades(this.carrera.nombre)
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
        if (this.segundaCarrera) {
            this.habilidadService.getHabilidades(this.segundaCarrera.nombre)
                .subscribe(
                habilidades => {
                    for (let habilidad of habilidades) {
                        if (habilidad.tipo == 'PROFESIONALES')
                            this.habilidadProfesionalesSegunda.push(habilidad);
                    }
                }, error => console.log('error: ' + error)
                );
        }

        this.personalidad = p;
        this.currentStep = 4;
    }

    verifyStep5() {
        this.currentStep += 1;
    }

    check(gusto) {
        if (this.gustos.find(obj => obj.id == gusto.id) == null)
            this.gustos.push(gusto);
        else
            this.gustos = this.gustos.filter(obj => obj.id != gusto.id);
    }

    isCheck(gusto: Gusto) {
        return this.gustos.find(obj => obj.id == gusto.id) == null ? false : true;
    }

    checkGustos() {
        this.currentStep = 5;
    }

    checkACPrincipal(ac){
        if (this.ACSelected.find(obj => obj == ac) == null)
            this.ACSelected.push(ac);
        else
            this.ACSelected = this.ACSelected.filter(obj => obj != ac);
    }

    checkACSecundario(ac){
        if (this.ACSelectedSegunda.find(obj => obj == ac) == null)
            this.ACSelectedSegunda.push(ac);
        else
            this.ACSelectedSegunda = this.ACSelectedSegunda.filter(obj => obj != ac);
    }

    verifyStep4Profesor(){
        this.currentStep += 1;
    }

    sendRequestSignUp(){

    }
}