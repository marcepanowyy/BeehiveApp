import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit{


  minPrice = 0;
  maxPrice = 1000;
  step = 1;







  products: any = []
  categories: any = [];
  currPage: number = 1
  selectedCategory = ''
  sorting = 'none';

  chosenCategories = new FormControl('');

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.getProducts()
    this.getCategories();
  }

  onPageChange(event: any) {
    this.currPage = event.pageIndex + 1
    this.getProducts()
  }

  private getProducts(){
    this.api.getProducts(this.currPage).subscribe({
      next: (res) => {
        this.products = res
      },
      error: (err) => {
        alert(err.message)
      }
    })
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

  private getFilteredProducts(categoryId: string){
    this.api.getProductsByCategoryId(categoryId, this.currPage).subscribe({
      next: (res) => {
        this.products = res
      },
      error: (err) => {
        alert(err.message)
      }
    })
  }

}
