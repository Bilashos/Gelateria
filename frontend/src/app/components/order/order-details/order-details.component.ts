import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { SocketService } from "../../../services/socket.service";
import { NotifyService } from "../../../services/notify.service";
import { Notify } from "../../../models/notify";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {
  order: any;
  orderStates: string[] = [];
  orderedProducts: any[] = [];
  isTableMode: boolean = false;
  isAdmin: boolean = false;
  total: any = {
    totQuantity: 0,
    totPrice: 0
  }
  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    public authService: AuthService,
    private socketService: SocketService,
    private notificationService: NotifyService) { }
  ngOnInit(): void {
    // passo l'ordine dal router
    const state = history.state;
    if (state && state.order) {
      const orderId = state.order._id;
      this.orderService.getOrder(orderId).subscribe(orderFromDb => {
        this.order = orderFromDb;
        // prendo tutti gli id dei prodotti presenti nell'ordine
        let productIds = this.order.products.map((product: any) => product.productId);
        // creo la lista dei prodotti
        this.productService.getProductsById(productIds).subscribe((p: Product[]) => {
          for (let i = 0; i < p.length; i++) {
            var orderedProduct = Object.assign({}, this.order.products[i], p[i])
            this.orderedProducts.push(orderedProduct);
            this.total.totQuantity += orderedProduct.quantity;
            this.total.totPrice += orderedProduct.quantity * orderedProduct.price;
          }
        })
      })

    }

    this.orderStates = Object.keys(Status);
  }
  updateOrder() {
    console.log(this.order);

    if (this.order.status == "terminato")
      this.order.closingDate = new Date();
    if (this.order.status == "consegnato") {
      if (this.order.closingDate == null)
        this.order.closingDate = new Date();
      this.order.shippingDate = new Date();
    }

    this.orderService.updateOrder(this.order).subscribe(result => {
      console.log(result);
      history.state.order = result;
      this.sendNotification();
    })
  }







  selectedOrderState: any;

  onStateChange(event: any) {
    this.selectedOrderState = event.value; // Aggiorna lo stato selezionato quando cambia
  }
  sendNotification() {
    console.log(this.order);
    // Recupera l'utente dall'ID
    const notifyDate = new Date(); // Ottieni la data corrente

    this.userService.getSingleUserById(this.order.user).subscribe(
      (userData: any) => {
        if (userData) {
          const username = userData.username;
          // Invia la notifica utilizzando il nome utente recuperato
          const message = "Il prodotto è nel seguente stato: " + this.order.status;
          this.socketService.sendNotification({ username: username, message: message });
          // Chiamata al metodo saveEvaso del servizio NotifyService
          this.notificationService.saveEvaso(username, notifyDate.toISOString(), this.order._id, false, message).subscribe(
            (notification: Notify) => {
              console.log("Notifica salvata con successo:", notification);
              // Gestisci la notifica salvata come preferisci
            }
          );
        }
      }
    );
  }
}
