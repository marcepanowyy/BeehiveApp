import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-reset.password',
  templateUrl: './reset.password.component.html',
  styleUrls: ['./reset.password.component.css']
})
export class ResetPasswordComponent {

  hide1: boolean = true;
  hide2: boolean = true;

  constructor(private _formBuilder: FormBuilder,
              private api: ApiService) {}


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', [Validators.required, Validators.email]],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)]),
    rpwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)])
  })

  get pwd(): FormControl{
    return this.thirdFormGroup.get("pwd") as FormControl
  }

  get rpwd(): FormControl{
    return this.thirdFormGroup.get("rpwd") as FormControl
  }


  sendVerificationCode(){


  }





}
