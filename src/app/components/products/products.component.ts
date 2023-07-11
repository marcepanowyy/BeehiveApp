import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit{

  categories: any = []; // create interface
  products: any = [] // create interface
  totalPages = 1
  totalProducts = 0
  pageSize = 1


  categoryIdArr: string[] = []


  data: any = {} // data interface

  minPrice = 0;
  maxPrice = 1000;
  order = 'none';

  currPage: number = 1

  chosenCategories = new FormControl('');


  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.getFilteredProducts()
    this.getCategories();
  }

  onPageChange(event: any) {
    this.currPage = event.pageIndex + 1
    this.getFilteredProducts()
  }

  private getCategories() {
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  private getFilteredProducts(){
    this.api.getFilteredProducts(this.data, this.currPage).subscribe({
      next: (res) => {
        const { products, totalPages, pageSize, totalProducts } = res;
        this.products = products;
        this.totalPages = totalPages;
        this.pageSize = pageSize;
        this.totalProducts = totalProducts;
      },
      error: (err) => {
        alert(err.message)
      }
    })
  }

  onCategorySelection(event: any) {
    this.data.categoryIdArr = event.value.map((category: any) => category.id)
    this.getFilteredProducts()
  }

  onOrderSelection(event: any){
    if(this.order === 'ascending'){
      this.data.ascending = true
      this.data.descending = false
    }
    else if (this.order === 'descending'){
      this.data.descending = true
      this.data.descending = false
    }
    else{
      this.data.ascending = false
      this.data.descending = false
    }
    this.getFilteredProducts()

  }

  onPriceInput(event: any){
    this.data.maxPrice = this.maxPrice
    this.data.minPrice = this.minPrice
    this.getFilteredProducts()
  }

}
