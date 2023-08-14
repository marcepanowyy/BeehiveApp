import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {UserRequest} from "../../interfaces/user/UserRequest";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  hide1 = true;

  constructor(private api: ApiService,
              private router: Router,
              private _formBuilder: FormBuilder
  ){}

  firstFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  secondFormGroup = this._formBuilder.group({
    pwd: ['', [Validators.required]]
  });

  get email(): FormControl{
    return this.firstFormGroup.get("email") as FormControl
  }

  get pwd(): FormControl{
    return this.secondFormGroup.get("pwd") as FormControl
  }

  login(){

    const data: UserRequest = {
      username: this.email.value,
      password: this.pwd.value
    }

    this.api.loginUser(data).subscribe({
      next: (res) => {
        alert("Login successful")
        localStorage.setItem('token', res.token)
        this.router.navigate(['Products'])

      },
      error: (err) => {
        alert(err.error.message)
      }
    })
  }

}

