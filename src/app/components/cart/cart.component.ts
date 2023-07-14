import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {MatDialog} from "@angular/material/dialog";
import {Dialog2Component} from "./dialog/dialog2.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  // interface

  products: any = []

  constructor(private api: ApiService,
              private matDialog: MatDialog){
  }

  ngOnInit() {

    const productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');

    for(const product of productsArray){

      this.api.getProductById(product.productId).subscribe({
        next: (res) => {
          const {id, name, category, price, description} = res
          const newProdObj = {id, name, category, price, description, quantity: product.quantity}
          this.products.push({...newProdObj})
        },
        error: (err) => {
          alert(err.message)
        }
      })
    }
  }

  // dialog

  openDialog(product: any){
    const dialog = this.matDialog.open(Dialog2Component, {
      width: '55%',
      height: 'auto',
      data: {product: product}
    })
  }

  // end dialog

  calculateTotalPrice() {
    const total = this.products.reduce((accumulator: number, product: { price: number; quantity: number; }) => {
      const productTotal = product.price * product.quantity;
      return accumulator + productTotal;
    }, 0);
    return total.toFixed(2)
  }

  buyItems(){

    const productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');

    this.api.createOrder({productsArray: [...productsArray]}).subscribe({
      next: (res) => {
        alert("Thank you for your purchase")
        localStorage.removeItem('productsArray')
        window.location.reload()
      },
      error: (err) => {
        alert(err.error.message)
      }
    })

  }


}

