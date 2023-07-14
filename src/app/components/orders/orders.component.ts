import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Order} from "../../interfaces/order/Order";
import {CartProduct} from "../../interfaces/product/CartProduct";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OrdersComponent implements OnInit{

  orders: Order[] = []
  totalPages: number = 1
  totalOrders: number = 0
  pageSize: number = 1
  currPage: number = 1

  columnsToDisplay = ['created', 'status', 'total'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  expandedElement: any

  constructor(
    private api: ApiService){}

  ngOnInit() {
    this.getOrders()
  }

  getOrders(){
    this.api.getUserOrders(this.currPage).subscribe({
      next: (res) => {
        const { orders, totalPages, pageSize, totalOrders } = res;
        this.orders = orders
        this.totalPages = totalPages;
        this.pageSize = pageSize;
        this.totalOrders = totalOrders;
      },
      error: (err) => {
        alert(err.error.message)
      }
    })
  }

  onPageChange(event: any) {
    this.currPage = event.pageIndex + 1
    this.getOrders()
  }

  countOrderSum(products: CartProduct[]){
    const total = products.reduce((accumulator, product) => {
      const productTotal = product.price * product.quantity;
      return accumulator + productTotal;
    }, 0);
    return total.toFixed(2)
  }

}


