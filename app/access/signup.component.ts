import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../utils/password-validation';

@Component({
    moduleId: module.id,
    selector: 'signup',
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})
export class SignUpComponent implements OnInit {

    currentStep: number;
    password: string;
    signup: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder
    ) {
        this.currentStep = 1;
    }

    ngOnInit() {
        this.signup = this.fb.group({
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