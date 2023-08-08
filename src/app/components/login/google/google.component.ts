import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleComponent {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: ApiService)
               {

    const id = this.route.snapshot.queryParams['id']
    this.loginGoogleUser(id)

  }

  loginGoogleUser(userTempId: string){
    this.api.loginGoogleUser(userTempId).subscribe({
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

}
