import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  // interface
  products: any = []

  constructor(private api: ApiService){
  }

  ngOnInit() {

    const productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');

    for(const product of productsArray){

      this.api.getProductById(product.productId).subscribe({
        next: (res) => {
          const {id, name, category, price, description} = res
          const newProdObj = {id, name, category, price, description}
          this.products.push({...newProdObj})
        },
        error: (err) => {
          alert(err.message)
        }
      })
    }

  }

}
