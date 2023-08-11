import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from './components/register/register.component';
import { NavComponent } from './components/nav/nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { MatCardModule } from '@angular/material/card';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { MatPaginatorModule } from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatRippleModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgFor} from "@angular/common";
import {MatSliderModule} from "@angular/material/slider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { OrdersComponent } from './components/orders/orders.component';
import {MatDialogModule} from "@angular/material/dialog";
import { Dialog1Component } from './components/products/dialog/dialog1.component';
import { Dialog2Component } from './components/cart/dialog/dialog2.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import { CartComponent } from './components/cart/cart.component';
import {MatBadgeModule} from "@angular/material/badge";
import {TokenInterceptor} from "./services/token.interceptor";
import {MatSidenavModule} from "@angular/material/sidenav";
import {CoolSocialLoginButtonsModule} from "@angular-cool/social-login-buttons";
import { GoogleComponent } from './components/login/google/google.component';
import { ResetPasswordComponent } from './components/reset.password/reset.password.component';
import {MatStepperModule} from "@angular/material/stepper";

const appRoutes: Routes = [
  {path: "Home", component: HomeComponent},
  {path: "Products", component: ProductsComponent},
  {path: "Categories", component: CategoriesComponent},
  {path: "Login", component: LoginComponent},
  {path: "Register", component: RegisterComponent},
  {path: "Orders", component: OrdersComponent},
  {path: "Cart", component: CartComponent},
  {path: "Google", component: GoogleComponent},
  {path: "ResetPassword", component: ResetPasswordComponent},
  {path: '', redirectTo: "Home", pathMatch: "full"},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    HomeComponent,
    ProductsComponent,
    CategoriesComponent,
    OrdersComponent,
    Dialog1Component,
    Dialog2Component,
    CartComponent,
    GoogleComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, {scrollPositionRestoration: "enabled"}),
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatRippleModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgFor,
    MatSliderModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatBadgeModule,
    MatSidenavModule,
    CoolSocialLoginButtonsModule,
    MatStepperModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
