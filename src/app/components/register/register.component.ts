import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {UserRequest} from "../../interfaces/user/UserRequest";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  constructor(private api: ApiService,
              private router: Router){}

  // at least 6 chars, one special char, one uppercase letter, two digits, max 24 chars

  // form control

  registerForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(18)]),
    pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)]),
    rpwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)])
  })

  hide1: boolean = true;
  hide2: boolean = true;

  get email(): FormControl{
    return this.registerForm.get("email") as FormControl
  }

  get pwd(): FormControl{
    return this.registerForm.get("pwd") as FormControl
  }

  get rpwd(): FormControl{
    return this.registerForm.get("rpwd") as FormControl
  }

  // register

  onSubmitClick(){
    if (this.validatePasswords()){
      this.registerUser()
    }
    else{
      alert("Cannot register user. Validation failed.")
    }
  }

  registerUser(){

    const data: UserRequest = {
      username: this.email.value,
      password: this.pwd.value
    }

    this.api.registerUser(data).subscribe({
      next: (res) => {
        alert("Registration completed.")
        localStorage.setItem('token', res.token)
        this.router.navigate(['Products'])
      },
      error: (err) => {
        alert(err.error.message)
      }
    })

  }

  // errors

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
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

}

