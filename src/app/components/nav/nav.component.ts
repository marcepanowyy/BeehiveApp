import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {ProductRequest} from "../../interfaces/product/ProductRequest";

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
    const sum = productsArray.reduce((accumulator: number, product: ProductRequest) => {
      return accumulator + product.quantity;
    }, 0);
    return  sum ? `(${sum})` : ""
  }

}
