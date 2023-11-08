import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  endPoint = "http://localhost:3000/api/product";

  constructor(private http: HttpClient) { }
  public createProduct(product: Product):any {
    return this.http.post(this.endPoint + "/create-product", product);
  }
}
