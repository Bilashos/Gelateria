import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    // Recupera l'ID del prodotto dalla route
    const productId = this.route.snapshot.paramMap.get('productId');

    // Chiamata al servizio per ottenere il singolo prodotto
    if (productId) {
      this.productService.getSingleProduct(productId)
        .subscribe(result => {
          this.product = result;
        });
    }
  }
}
