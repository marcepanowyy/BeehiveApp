import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description'];

  // create interface
  categories: any = [];

  totalPages: number = 1
  totalCategories: number = 0
  pageSize: number = 1
  currPage: number = 1

  constructor(private api: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.api.getCategories(this.currPage).subscribe({
      next: (res) => {
        const { categories, totalPages, pageSize, totalCategories } = res;
        this.categories = categories;
        this.totalPages = totalPages;
        this.pageSize = pageSize;
        this.totalCategories = totalCategories;
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
