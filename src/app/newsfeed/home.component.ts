import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {IdeaService} from '../services/idea.service'

import {Idea} from '../entities/idea'

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    //styleUrls: ['']
})
export class HomeComponent implements OnInit{

    ideaForm : FormGroup;
    
    selectedValueTipo :string;
    contenido : string;
    numeroEstudiantes : number;
    alcance : string;
    problematica : string;


    constructor(
        private fb : FormBuilder,
        private ideaService : IdeaService
    ){
        this.selectedValueTipo = 'NU';
    }

    ngOnInit(){
        this.ideaForm = this.fb.group({
            /*contenidoControl : ['', Validators.required],
            numeroEstudiantesControl : ['',Validators.required],
            alcanceControl : ['',Validators.required],
            problematicaControl : ['',Validators.required]*/
        });
    }

    crearIdea(){
        let idea: Idea = new Idea();
        idea.alcance = this.alcance;
        idea.tipo = this.selectedValueTipo;
        idea.contenido = this.contenido;
        idea.numeroEstudiantes = this.numeroEstudiantes;
        idea.problematica = this.problematica;
        console.log(idea);
        this.ideaService.crearIdea(idea)
            .subscribe(res=>{
                //punlicarla y decilre exito
            },error =>{
                console.log("Error "+ error);
            });
    }
}