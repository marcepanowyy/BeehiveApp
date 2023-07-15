import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Filter} from "../interfaces/filter/Filter";
import {User} from "../interfaces/user/User";
import {Category} from "../interfaces/category/Category";
import {UserRO} from "../interfaces/user/UserRO";
import {CreateOrder} from "../interfaces/order/CreateOrder";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getFilteredProducts(data: Filter, page: number = 1){
    return this.http.post<any>(`http://localhost:4000/products/filter?page=${page}`, data);
  }

  getProductById(productId: string){
    return this.http.get<any>(`http://localhost:4000/products/${productId}`);
  }

  getCategories(page: number = 1){
    return this.http.get<any>(`http://localhost:4000/categories?page=${page}`);
  }

  getAllCategories(){
    return this.http.get<Category[]>("http://localhost:4000/categories/all")
  }

  registerUser(data: User){
    return this.http.post<UserRO>("http://localhost:4000/users/register", data)
  }

  loginUser(data: User){
    return this.http.post<UserRO>("http://localhost:4000/users/login", data)
  }

  getUserOrders(page: number = 1){
    return this.http.get<any>(`http://localhost:4000/orders/user/?page=${page}`)
  }

  createOrder(order: CreateOrder){
    return this.http.post<any>("http://localhost:4000/orders", order)
  }



}
