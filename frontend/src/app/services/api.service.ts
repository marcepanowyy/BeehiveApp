import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Filter} from "../interfaces/filter/Filter";
import {UserRequest} from "../interfaces/user/UserRequest";
import {CategoriesResponse} from "../interfaces/category/CategoriesResponse";
import {ProductsResponse} from "../interfaces/product/ProductsResponse";
import {Category} from "../interfaces/category/Category";
import {Product} from "../interfaces/product/Product";
import {UserResponse} from "../interfaces/user/UserResponse";
import {OrdersResponse} from "../interfaces/order/OrdersResponse";
import {RegistrationResponse} from "../interfaces/user/RegistationResponse";
import {ResetPasswordRequest} from "../interfaces/user/ResetPasswordRequest";
import {ProductRequest} from "../interfaces/product/ProductRequest";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  // orders

  getUserOrders(page: number = 1){
    return this.http.get<OrdersResponse>(`http://localhost:4000/orders/user/?page=${page}`)
  }

  checkout(products: ProductRequest[]){
    return this.http.post<{url: string}>("http://localhost:4000/payments/checkout", products)
  }

  // users

  registerUser(data: UserRequest){
    return this.http.post<RegistrationResponse>("http://localhost:4000/auth/register", data)
  }

  loginUser(data: UserRequest){
    return this.http.post<UserResponse>("http://localhost:4000/auth/login", data)
  }

  loginGoogleUser(userTempId: string, tokenIgnore: boolean = false) {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${userTempId}`
    });

    const options = {
      headers: headers,
      params: { tokenIgnore: tokenIgnore.toString() }
    };

    return this.http.post<any>("http://localhost:4000/auth/google/login", {}, options);
  }

  sendResetPasswordMail(data: Partial<ResetPasswordRequest>){
    return this.http.post<boolean>("http://localhost:4000/auth/reset", data);
  }

  confirmCode(data: Partial<ResetPasswordRequest>){
    return this.http.post<boolean>("http://localhost:4000/auth/password/code/confirmation", data)
  }

  changePassword(data: ResetPasswordRequest){
    return this.http.post<boolean>("http://localhost:4000/auth/password/change", data)
  }

  // products

  getFilteredProducts(data: Filter, page: number = 1){
    return this.http.post<ProductsResponse>(`http://localhost:4000/products/filter?page=${page}`, data);
  }

  getProductById(productId: string){
    return this.http.get<Product>(`http://localhost:4000/products/${productId}`);
  }

  // categories

  getCategories(page: number = 1){
    return this.http.get<CategoriesResponse>(`http://localhost:4000/categories?page=${page}`);
  }

  getAllCategories(){
    // no pagination info that's why Category[], not CategoryResponse
    return this.http.get<Category[]>("http://localhost:4000/categories/all")
  }


}

