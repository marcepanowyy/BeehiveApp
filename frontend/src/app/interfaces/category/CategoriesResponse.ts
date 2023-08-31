import {Category} from "./Category";
import {PaginationInfo} from "../pagination/Pagination";

export interface CategoriesResponse {
  categories: Category[]
  info: PaginationInfo
}
