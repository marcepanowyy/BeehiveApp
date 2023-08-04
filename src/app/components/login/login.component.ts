import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {UserRequest} from "../../interfaces/user/UserRequest";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

const googleLogoURL =
  "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private api: ApiService,
              private router: Router,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer){
    this.matIconRegistry.addSvgIcon("logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL))
  }

  // form control

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(18)]),
    pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24), Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/)]),
  })

  hide1 = true;

  get email(): FormControl{
    return this.loginForm.get("email") as FormControl
  }

  get pwd(): FormControl{
    return this.loginForm.get("pwd") as FormControl
  }

  // login

  onSubmitClick(){
    this.loginUser()
  }

  loginUser(){

    const data: UserRequest = {
      username: this.email.value,
      password: this.pwd.value
    }

    this.api.loginUser(data).subscribe({
      next: (res) => {
        alert("You are logged in.")
        localStorage.setItem('token', res.token)
        this.router.navigate(['Products'])

      },
      error: (err) => {
        alert(err.error.message)
      }
    })
  }

  loginUserByGoogle(){

    this.api.loginUserByGoogle().subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        console.log(err)
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

}

