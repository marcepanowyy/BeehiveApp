import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  constructor(private api: ApiService){}


  // at least 6 chars, one special char, one uppercase letter, two digits, max 24 chars

  registerForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(18)]),
    pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)]),
    rpwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)])
  })

  hide1 = true;
  hide2 = true;

  get email(): FormControl{
    return this.registerForm.get("email") as FormControl
  }

  get pwd(): FormControl{
    return this.registerForm.get("pwd") as FormControl
  }

  get rpwd(): FormControl{
    return this.registerForm.get("rpwd") as FormControl
  }

  // errors

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage(){
    if (this.pwd.hasError('minLength')) return 'You must enter password with min 6 characters'
    if (this.pwd.hasError('maxLength')) return 'You must enter password with max 24 characters'
    if (this.pwd.hasError('pattern')) return "Password must contain at least one special char, one uppercase letter and two digits"
    return 'not a valid password'
  }

  validatePasswords(){
    return this.pwd === this.rpwd
  }


}

