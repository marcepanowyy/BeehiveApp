import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {environment} from "../../../../../environment";

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleComponent {

  private tempUserId: string = ''

  constructor(private router: Router,
              private api: ApiService) {}

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

  async googleAuth(): Promise <void>{
    const url = this.getGoogleLoginUrl()
    const authWindow = await window.open(url, '', 'popup-true')
    if (authWindow){
      const checkPopupWindow = setInterval(() => {
        if (authWindow.closed){
          clearInterval(checkPopupWindow)
          if (this.tempUserId) this.loginGoogleUser(this.tempUserId)
          this.tempUserId = ''
        }
      }, 100)
    }
  }

  private getGoogleLoginUrl(){
    const state = crypto.randomUUID()
    this.tempUserId = state
    const googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    const loginRequestParameters: { [key: string]: string } = {
      response_type: 'code',
      redirect_uri: environment.googleConfig.redirect_uri,
      scope: environment.googleConfig.scope,
      client_id: environment.googleConfig.client_id,
      state
    };
    const paramsString = Object.keys(loginRequestParameters)
      .map((key) => `${key}=${encodeURIComponent(loginRequestParameters[key])}`)
      .join('&');
    return `${googleAuthEndpoint}?${paramsString}`
  }

}
