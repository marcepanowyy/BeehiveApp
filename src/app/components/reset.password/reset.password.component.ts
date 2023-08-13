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
  disableChangePassword: boolean = true

  constructor(private _formBuilder: FormBuilder,
              private api: ApiService) {}


  firstFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  secondFormGroup = this._formBuilder.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  thirdFormGroup = this._formBuilder.group({
    pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)]),
    rpwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)])
  })

  get email(): FormControl{
    return this.firstFormGroup.get('email') as FormControl
  }

  get code(): FormControl{
    return this.secondFormGroup.get('code') as FormControl
  }

  get pwd(): FormControl{
    return this.thirdFormGroup.get("pwd") as FormControl
  }

  get rpwd(): FormControl{
    return this.thirdFormGroup.get("rpwd") as FormControl
  }

  getPasswordErrorMessage() {
    if (this.pwd.hasError('minlength')) {
      return 'You must enter a password with a minimum of 6 characters.';
    }

    if (this.pwd.hasError('maxlength')) {
      return 'You must enter a password with a maximum of 24 characters.';
    }

    return 'At least two digits, one uppercase & lowercase letter, one special character';
  }

  validatePasswords(){
    return this.pwd.value === this.rpwd.value
  }

  sendVerificationCode(){

    if(this.email.valid){
      this.api.sendResetPasswordMail(this.email.value).subscribe({
        next: (res) => {
        },
        error: (err) => {
          alert(err)
        }
      })
    }
    else {
      alert('Invalid email address')
    }

  }

  confirmCode(){

    if(this.email.valid){
      this.api.confirmCode(this.email.value, this.code.value).subscribe({
        next: (res) => {
          this.disableChangePassword = false
          alert('Verification code has been accepted')
        },
        error: () => {
          alert('Please enter the valid verification code.')
        }
      })
    }
    else {
      alert('Invalid verification code. It should be a 6-digit numeric value.')
    }
  }

  changePassword(){

    if(this.pwd.value === this.rpwd.value){
      this.api.changePassword(this.email.value, this.code.value, this.pwd.value).subscribe({
        next: (res) => {
          console.log(res)
          alert(res)
        },
        error: (err) => {
          console.log(err)
          alert(err)
        }
      })
    }

    else {
      alert('Passwords do not match.')
    }

  }







}
