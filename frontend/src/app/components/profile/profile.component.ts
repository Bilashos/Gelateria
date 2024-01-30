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

    this.productService.getBestProducts().subscribe((data: any) => {
        this.bestProducts = data;
        console.log(this.bestProducts);
    });

  }
}

/*
 */

