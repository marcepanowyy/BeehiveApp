import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {CartProduct} from "../../../interfaces/product/CartProduct";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class Dialog2Component {

  product: any
  selectedAmount = new FormControl(1, [Validators.max(10), Validators.min(0)]);

  constructor(private ref: MatDialogRef<Dialog2Component>,
              @Inject(MAT_DIALOG_DATA) public data: CartProduct) {

  }

  closeDialog(){
    this.ref.close()
  }

  getArrFromLocalStorage(){
    return JSON.parse(localStorage.getItem('productsArray') || '[]');
  }

  removeProductFromLocalStorage(){

    const productsArray = this.getArrFromLocalStorage()

    const newProductsArray = productsArray.filter((product: any) => product.productId !== this.product.id);
    localStorage.setItem('productsArray', JSON.stringify([...newProductsArray]));

    this.closeDialog()
    window.location.reload()
  }

  updateLocalStorage() {

    const productsArray = this.getArrFromLocalStorage()

    const myObject = { quantity: this.selectedAmount.value, productId: this.product.id };

    const existingProductIndex = productsArray.findIndex((product: any) => product.productId === myObject.productId);

    if (existingProductIndex !== -1) {
      productsArray[existingProductIndex].quantity = myObject.quantity;
    } else {
      productsArray.push({ ...myObject });
    }

    localStorage.setItem('productsArray', JSON.stringify([...productsArray]));
  }

  closeAndSave() {

    if (this.selectedAmount.valid) {

      this.updateLocalStorage()
      this.ref.close();
      window.location.reload()

    } else if (this.selectedAmount.errors) {

      if (this.selectedAmount.hasError('min')) {
        alert("Selected amount is below the minimum value.");

      } else if (this.selectedAmount.hasError('max')) {
        alert("Selected amount exceeds the maximum value.");
      }
    }
  }

  ngOnInit() {
    this.product = this.data
    this.selectedAmount = new FormControl(this.product.quantity);

  }


}
