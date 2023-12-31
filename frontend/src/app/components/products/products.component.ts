import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ApiService } from "../../services/api.service";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Dialog1Component } from "./dialog/dialog1.component";
import { Filter } from "../../interfaces/filter/Filter";
import { Category } from "../../interfaces/category/Category";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {Product} from "../../interfaces/product/Product";
import {MatPaginator} from "@angular/material/paginator";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  categories: Category[] = [];
  products: Product[] = [];

  totalPages: number = 1;
  totalItems: number = 0;
  pageSize: number = 1;
  currPage: number = 1;

  // debounce filter

  private filterSubject = new Subject<Filter>();

  data: Filter = {};

  minPrice: number = 0;
  maxPrice: number = 1000;
  order: string = 'none'; // ascending or descending
  categoryIdArr: string[] = [];

  chosenCategories = new FormControl('');

  constructor(private api: ApiService,
              private route: ActivatedRoute,
              private matDialog: MatDialog) {}

  ngOnInit() {
    this.initializeFilter()
    this.getFilteredProducts();
    this.getAllCategories();
  }

  private initializeFilter(){
    this.filterSubject.pipe(debounceTime(300)).subscribe(() => {
      this.paginator.firstPage();
      this.getFilteredProducts();
    })
  }

  private getFilteredProducts() {
    this.api.getFilteredProducts(this.data, this.currPage).subscribe({
      next: (res) => {
        const { products, info } = res;
        this.products = products;
        this.totalPages = info.totalPages;
        this.pageSize = info.pageSize;
        this.totalItems = info.totalItems;
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  private getAllCategories() {
    this.api.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  onPageChange(event: any) {
    this.currPage = event.pageIndex + 1;
    this.getFilteredProducts()
    this.scrollPageToTop();
  }

  onCategorySelection(event: any) {
    this.data.categoryIdArr = event.value.map((category: any) => category.id);
    this.filterSubject.next(this.data);
  }

  onOrderSelection(event: any) {
    if (this.order === 'ascending') {
      this.data.ascending = true;
      this.data.descending = false;
    } else if (this.order === 'descending') {
      this.data.ascending = false;
      this.data.descending = true;
    } else {
      this.data.ascending = false;
      this.data.descending = false;
    }
    this.filterSubject.next(this.data);
  }

  onPriceInput(event: any) {
    this.data.maxUnitPrice = this.maxPrice * 100;
    this.data.minUnitPrice = this.minPrice * 100;
    this.filterSubject.next(this.data);
  }

  openDialog(product: any) {
    if (this.isLoggedIn()) {
      const dialog = this.matDialog.open(Dialog1Component, {
        width: '30%',
        height: '16rem',
        data: { ...product }
      });
    } else {
      alert("To add a product to the shopping cart, you need to be logged in.");
    }
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  private scrollPageToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


}
