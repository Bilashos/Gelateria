import { Component, ViewChild } from '@angular/core';
import { NotifyService } from "../../services/notify.service";
import { Notify } from "../../models/notify";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { OrderService } from 'src/app/services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent {
  notifications: Notify[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  notificationsView: Notify[] = [];
  filteredNotifications: Notify[] = [];
  isAll: boolean = true; // true per tutte le notifiche, false per non lette

  constructor(
    private notifyService: NotifyService,
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService,
    private _snackBar: MatSnackBar
  ) { }

  // Variabili per gestire il paginator
  pageEvent: PageEvent | undefined;
  length = 50;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.loadNotify();
    this.notifyService.modify.subscribe(d => {
      this.loadNotify();
    });
  }

  // Metodo per gestire gli eventi del paginator
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.setNotificationsVariable();
  }

  // Metodo per impostare le notifiche da visualizzare in base al paginator
  setNotificationsVariable() {
    let elementi = this.pageSize;
    if ((this.pageIndex + 1) * this.pageSize > this.notifications.length) {
      elementi = (this.notifications.length - this.pageIndex * this.pageSize);
    }
    this.notificationsView = this.notifications.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize) + elementi);
  }

  // Metodo per caricare le notifiche
  loadNotify() {
    const currentUser = this.authService.getUserFromToken();
    if (currentUser) {
      this.notifyService.getUserNotifications(currentUser.username).subscribe(
        (notifications: any[]) => {
          if (this.isAll) {
            this.notifications = notifications;
          } else {
            this.notifications = notifications.filter(notifica => !notifica.read);
          }
          this.setNotificationsVariable();
        },
        (error: any) => {
          console.error('Errore durante il recupero delle notifiche:', error);
        }
      );
    }
  }

  // Metodo per aprire i dettagli di un ordine
  openDetail(id: string) {
    if (id) {
      this.orderService.getOrder(id).subscribe(
        orderToPass => {
          if (orderToPass) {
            this.router.navigate(['/order/detail'], { state: { order: orderToPass } });
          }
        },
        (error: any) => {
          const message = 'Errore durante il recupero degli ingredienti';
          this._snackBar.open(message, 'Chiudi', {
            duration: 5 * 1000,
          });
          console.error(message, error);
        }
      );
    }
  }

  // Metodo per eliminare una notifica
  deleteNotification(notificationId: string) {
    this.notifyService.deleteNotification(notificationId).subscribe(
      (response) => {
        if (this.notificationsView.length === 1 && this.paginator) {
          this.paginator.firstPage();
        }
        this.loadNotify();
        this.notifyService.notifySubscribers();
      },
      (error: any) => {
        console.error('Errore durante l\'eliminazione della notifica:', error);
      }
    );
  }

  // Metodo per aggiornare lo stato di lettura di una notifica
  updateReadStatus(notification: Notify) {
    this.notifyService.updateNotification(notification._id, notification.read).subscribe(
      (response) => {
        this.loadNotify();
      },
      (error: any) => {
        console.error('Errore durante l\'aggiornamento dello stato di lettura della notifica:', error);
      }
    );
  }

  // Metodo per impostare le notifiche
  setNotifications() {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadNotify();
  }
}
