import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getProducts(page: number = 1){
    return this.http.get<any>(`http://localhost:4000/products?page=${page}`);
  }

  getProductsByCategoryId(categoryId: string, page: number = 1){
    return this.http.get<any>(`http://localhost:4000/categories/${categoryId}?page=${page}`);
  }

  getCategories(){
    return this.http.get<any>("http://localhost:4000/categories");
  }

}
