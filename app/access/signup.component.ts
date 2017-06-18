import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../utils/password-validation';

//Entities
import { Personalidad } from '../entities/personalidad';
import { Carrera } from '../entities/carrera';

//Services
import { PersonalidadService } from '../services/personalidad.service';
import { CarreraService } from '../services/carrera.service';

@Component({
    moduleId: module.id,
    selector: 'signup',
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})
export class SignUpComponent implements OnInit {

    currentStep: number;
    password: string;
    
    //Formgroups
    stepOneForm: FormGroup;

    //Info retrieve of server
    personalidades: Personalidad[];
    carreras: Carrera[];

    //Step 2 attributes
    carrera: Carrera;
    segundaCarrera: Carrera;
    tipoUsuario: string;
    semestre:number;
    seminario:boolean;
    temaTG:boolean;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private personalidadService: PersonalidadService,
        private carreraService: CarreraService
    ) {
        this.semestre = 1;
        this.currentStep = 1;
        this.seminario = false;
        this.temaTG = false;
        this.personalidadService.getAllPersonalidades()
            .subscribe(
                personalidades =>{
                    this.personalidades = personalidades;
                },
                    error => console.log("error: "+error)
            );

        this.carreraService.getAllCarreras()
            .subscribe(
                carreras => {
                    this.carreras = carreras;
                    this.carrera = this.carreras[0];
                },
                    error => console.log("error: "+error)
            );
    }

    ngOnInit() {
        this.stepOneForm = this.fb.group({
            password: ['', Validators.compose([Validators.required, 
                    Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])],
            email: ['',[Validators.required,Validators.pattern('^([a-zA-Z]+[0-9]*)*@[a-zA-Z]+[0-9]*(\.[a-zA-Z])+$')]],
            name: ['',Validators.required],
            lastName: ['',Validators.required],
            confirmPassword: ['',Validators.required],
            username: ['',Validators.required]
        },{
            validator: PasswordValidation.MatchPassword
        });
    }

    verifyStep1() {
        this.currentStep = 2;
    }

    verifyStep2(){
        this.currentStep = 3;
    }

    verifyStep3(){
        this.currentStep = 4;
    }
}