import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor(private snackBar: MatSnackBar, private authService: AuthService, private notificationService: NotifyService) {
    this.connect();
  }
  connect(){
    // Connetti al server Socket.IO
    if(this.socket && this.socket.isConnected){
      this.socket.disconnect();
    }
    this.socket = io('http://localhost:3000', {
      extraHeaders: {Authorization: "Bearer " + this.authService.getTokenFromLocalStorage()}
    });
    console.log("socket connected");
    //console.log(this.socket);
    this.registerHandlers();
  }

  registerChatHandlers(callback: any){
    /*this.socket.on('newMessage', (data: any) => {
      callback('newMessage', data);
    });*/
    this.socket.onAny((eventName : any, data : any) => callback(eventName, data));
  }

  //in ascolto da backend
  registerHandlers(){
    this.socket.on('notification', (data: any) => {
      console.log('Notifica ricevuta:', data);
      this.notificationService.notifySubscribers();
    // Emetti l'evento tramite un Observable
      this.snackBarMessage(data);
    });
    this.socket.on('update', (data: any) => {
      console.log('Notifica ricevuta:', data);
      // Emetti l'evento tramite un Observable
      this.snackBarMessage(data);
    });
    this.socket.on("welcome", (data: any) =>{
      console.log("messaggio: " + data);
    });
    this.socket.on('productAvailable', (data: any) => {
      console.log('Notifica ricevuta:', data);
      // Emetti l'evento tramite un Observable
      this.snackBarMessage(data);
    });

  }
  snackBarMessage(data: any){
    this.snackBar.open(data.message, 'Chiudi', {
      duration: 3000
    });
  }

  // Metodo per inviare una notifica a tutti
  sendNotification(notification: any) {
    this.socket.emit('sendNotification', notification);
  }

  sendMessage(message: any){
    this.socket.emit('messageSent', message)
  }

  notifyChatDisplayed(currentUser: string, remoteUser: string){
    this.socket.emit('chatDisplayed', {currentUser: currentUser, remoteUser: remoteUser});

  }


}
