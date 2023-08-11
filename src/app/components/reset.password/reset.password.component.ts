import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-reset.password',
  templateUrl: './reset.password.component.html',
  styleUrls: ['./reset.password.component.css']
})
export class ResetPasswordComponent {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}
}
