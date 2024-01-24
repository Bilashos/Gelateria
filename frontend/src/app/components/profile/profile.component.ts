import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfiloComponent implements OnInit {
  user: User | undefined;
  bestProducts: Product[] = [];

  constructor(private auth: AuthService, private productService: ProductService) { }

  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();

    this.productService.getBestProducts().subscribe((data) => {
        this.bestProducts = data;
        console.log(this.bestProducts);
    });
    /*this.user = this.auth.getUserFromToken();

    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products);

      this.filteredProducts = this.products.slice(0, 3);

    });*/
  }
}

/*
 */

