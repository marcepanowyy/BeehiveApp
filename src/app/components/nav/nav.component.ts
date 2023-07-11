import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit{

  isLoggedIn: boolean = false;

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = token !== null;
  }

  logOut(){
    localStorage.removeItem('token')
    this.isLoggedIn = false
  }

}
