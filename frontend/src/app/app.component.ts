import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SocketService} from "./services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gelateria';
  user: any;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private route: Router, private socket: SocketService) {
    this.route.events.subscribe( d => {
      if(d instanceof NavigationEnd) {
        this.user = authService.getUserFromToken();
        if (this.user)
          this.isAdmin = this.user.role == "amministratore";
        //console.log(d);
      }
    })
    console.log(socket);
  }
    logOut() {
        this.authService.logout();
        location.reload();
        this.route.navigate(['/login']); //forse dopo admin è da togliere perche fa reload da solo
    }

  inviaNotifica() {
    const notification = { message: 'HAI CLICCATO IL BOTTONE' }; // Puoi cambiare il messaggio come desideri
    this.socket.sendNotification(notification);

  }


  inviaNotifica2() {
    const notification = { message: 'UPDATE' }; // Puoi cambiare il messaggio come desideri
    this.socket.sendNotification(notification);
  }
}
