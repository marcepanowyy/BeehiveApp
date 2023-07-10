import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description'];
  categories: any = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getCategories();
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

}
