import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {FormControl} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Dialog1Component} from "./dialog/dialog1.component";
import {Product} from "../../interfaces/Product";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit{

  categories: any = []; // create interface
  products: Product[] = [] // create interface
  totalPages: number = 1
  totalProducts: number = 0
  pageSize: number = 1
  currPage: number = 1

  categoryIdArr: string[] = []

  data: any = {} // data interface

  minPrice = 0;
  maxPrice = 1000;
  order = 'none';

  showFiller = false;

  chosenCategories = new FormControl('');

  constructor(private api: ApiService,
              private route: ActivatedRoute,
              private matDialog: MatDialog) {
  }

  ngOnInit() {

    this.getFilteredProducts()
    this.getAllCategories();
  }

  onPageChange(event: any) {
    this.currPage = event.pageIndex + 1
    this.getFilteredProducts()
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

  private getAllCategories(){
    this.api.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res
      },
      error: (err) => {
        alert(err)
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

  // dialog

  openDialog(product: any){
    if(this.isLoggedIn()) {
      const dialog = this.matDialog.open(Dialog1Component, {
        width: '30%',
        height: '16rem',
        data: {product: product}
      })
    }
    else {
      alert("To add a product to the shopping cart, you need to be logged in.")
    }
  }

  isLoggedIn(){
    return localStorage.getItem('token') !== null
  }


}
