import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Product} from "../../../interfaces/product/Product";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class Dialog1Component implements OnInit{

  product: any
  selectedAmount = new FormControl(1, [Validators.max(10), Validators.min(0)]);

  constructor(private ref: MatDialogRef<Dialog1Component>,
              @Inject(MAT_DIALOG_DATA) public data: Product){}

  closeDialog(){
    this.ref.close()
  }

  updateLocalStorage() {
    const productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');

    const myObject = { quantity: this.selectedAmount.value, productId: this.product.id };

    // add interface
    const existingProductIndex = productsArray.findIndex((product: any) => product.productId === myObject.productId);

    if (existingProductIndex !== -1) {
      productsArray[existingProductIndex].quantity += myObject.quantity;
    } else {
      productsArray.push({ ...myObject });
    }

    localStorage.setItem('productsArray', JSON.stringify(productsArray));
}

  closeAndSave() {

    if (this.selectedAmount.valid) {
      this.updateLocalStorage()
      this.ref.close();

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
  }

}
