import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit{

  // add product interface

  product: any
  selectedAmount = new FormControl(1, [Validators.max(10), Validators.min(0)]);

  constructor(private ref: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  closeDialog(){
    this.ref.close()
  }

  closeAndSave() {
    if (this.selectedAmount.valid) {
      this.ref.close();
      alert(`Selected amount: ${this.selectedAmount.value}`);
    } else if (this.selectedAmount.errors) {
      if (this.selectedAmount.hasError('min')) {
        alert("Selected amount is below the minimum value.");
      } else if (this.selectedAmount.hasError('max')) {
        alert("Selected amount exceeds the maximum value.");
      }
    }
  }

  ngOnInit() {
    console.log(this.data)
    this.product = this.data.product
  }


}
