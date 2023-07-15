import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import {Category} from "../../interfaces/category/Category";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description'];

  categories: Category[] = [];

  totalPages: number = 1
  totalItems: number = 0
  pageSize: number = 1
  currPage: number = 1

  constructor(private api: ApiService){}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.api.getCategories(this.currPage).subscribe({
      next: (res) => {
        const { categories, info } = res;
        this.categories = categories;
        this.totalPages = info.totalPages;
        this.pageSize = info.pageSize;
        this.totalItems = info.totalItems;
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  onPageChange(event: any) {
    this.currPage = event.pageIndex + 1;
    this.getCategories();
  }


}
