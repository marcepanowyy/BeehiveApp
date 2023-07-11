import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }


  // add data interface
  getFilteredProducts(data: any, page: number = 1){
    return this.http.post<any>(`http://localhost:4000/products/filter?page=${page}`, data);
  }

  getCategories(){
    return this.http.get<any>("http://localhost:4000/categories");
  }

  // add data interface
  registerUser(data: any){
    return this.http.post<any>("http://localhost:4000/users/register", data)
  }

  loginUser(data: any){
    return this.http.post<any>("http://localhost:4000/users/login", data)
  }

}
