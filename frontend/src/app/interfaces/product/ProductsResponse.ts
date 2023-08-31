import {PaginationInfo} from "../pagination/Pagination";
import {Product} from "./Product";

export interface ProductsResponse {
  products: Product[];
  info: PaginationInfo;
}
