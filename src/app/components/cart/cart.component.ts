import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {MatDialog} from "@angular/material/dialog";
import {Dialog2Component} from "./dialog/dialog2.component";
import {CartProduct} from "../../interfaces/product/CartProduct";
import {loadStripe} from "@stripe/stripe-js";
import {environment} from "../../../../environment";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  cartProducts: CartProduct[] = []

  constructor(private api: ApiService,
              private matDialog: MatDialog){}

  ngOnInit() {
    this.getProductsById()
  }

  getProductsById(){

    const productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');

    for(const product of productsArray){

      this.api.getProductById(product.productId).subscribe({
        next: (res) => {
          const {id, name, category, price, description} = res
          const newProdObj: CartProduct = {id, name, category, price, description, quantity: product.quantity}
          this.cartProducts.push({...newProdObj})
        },
        error: (err) => {
          alert(err.message)
        }
      })
    }
  }

  // dialog

  openDialog(cartProduct: CartProduct){
    const dialog = this.matDialog.open(Dialog2Component, {
      width: '55%',
      height: 'auto',
      data: {...cartProduct}
    })
  }

  // end dialog

  calculateTotalPrice() {
    const total = this.cartProducts.reduce((accumulator, cartProduct) => {
      const cartProductTotal = cartProduct.price * cartProduct.quantity;
      return accumulator + cartProductTotal;
    }, 0);
    return total.toFixed(2)
  }

  getArrFromLocalStorage(){
    return JSON.parse(localStorage.getItem('productsArray') || '[]');
  }

  async checkout() {

    const cartProducts = this.getArrFromLocalStorage()

    this.api.checkout(cartProducts).subscribe({
      next: async (session: any) => {
        console.log(session)
        const stripe = await loadStripe(environment.stripeConfig.publishable_key);
        stripe?.redirectToCheckout({
          sessionId: session.id
        })
      },
      error: (err) => {
        alert(err)
      }
    })
  }


}

