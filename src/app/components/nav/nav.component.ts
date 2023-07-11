import {Component} from '@angular/core';
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
    localStorage.clear()
    this.router.navigate(['Login'])
  }

  getProductsSum() {
    const productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');
    // add interface
    const sum = productsArray.reduce((accumulator: any, product: { quantity: any; }) => {
      return accumulator + product.quantity;
    }, 0);
    return  sum ? `(${sum})` : ""
  }

}
