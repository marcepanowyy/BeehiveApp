import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {UserRequest} from "../../interfaces/user/UserRequest";
import {environment} from "../../../../environment";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  private tempGoogleUserId: string = ''

  constructor(private api: ApiService,
              private router: Router
  ){

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

  // errors

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}

