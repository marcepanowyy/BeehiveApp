import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Filter} from "../interfaces/filter/Filter";
import {UserRequest} from "../interfaces/user/UserRequest";
import {CategoriesResponse} from "../interfaces/category/CategoriesResponse";
import {ProductsResponse} from "../interfaces/product/ProductsResponse";
import {Category} from "../interfaces/category/Category";
import {Product} from "../interfaces/product/Product";
import {UserResponse} from "../interfaces/user/UserResponse";
import {OrdersResponse} from "../interfaces/order/OrdersResponse";
import {OrderRequest} from "../interfaces/order/OrderRequest";
import {OrderResponse} from "../interfaces/order/OrderResponse";

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

  createOrder(order: OrderRequest){
    return this.http.post<OrderResponse>("http://localhost:4000/orders", order)
  }

  // users

  registerUser(data: UserRequest){
    return this.http.post<UserResponse>("http://localhost:4000/users/register", data)
  }

  loginUser(data: UserRequest){
    return this.http.post<UserResponse>("http://localhost:4000/users/login", data)
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
