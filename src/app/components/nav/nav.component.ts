import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent{

  constructor(private router: Router){}

  isLoggedIn(){
    return localStorage.getItem('token') !== null
  }

  logOut(){
    localStorage.removeItem('token')
    this.router.navigate(['Login'])
  }

}
