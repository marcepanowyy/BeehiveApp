import {PaginationInfo} from "../pagination/Pagination";
import {Order} from "./Order";

export interface OrdersResponse {
  orders: Order[]
  info: PaginationInfo
}
