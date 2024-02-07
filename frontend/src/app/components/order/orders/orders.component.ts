import { Component } from '@angular/core';
import { Order, Status } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import {Product} from "../../../models/product";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})

export class OrdersComponent {
  orders: Product[] = [];
  user: any;
  constructor(private authService: AuthService, private orderService: OrderService) {
    //this.user = authService.getUserFromToken();
    orderService.getOrdersFromUser().subscribe((oldOrders: any) => {
      console.log(oldOrders);
      this.orders = oldOrders.splice(0,3);

    })
  }
  getStatusIcon(status:string): string {
    let key = status as keyof typeof Status;
    var val = Status[key];
    return val;
  }
}
