import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from "../../services/socket.service";
import { ChatUser } from "../../models/chatUser";
import { AuthService } from "../../services/auth.service";
import { ChatService } from "../../services/chat.service";
import { ChatMessage } from "../../models/chatMessage";
import { Observable } from "rxjs";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  sender: any;
  receiver: any;
  messages: ChatMessage[] = [];
  message: string = '';
  currentUser: string = '';
  users: ChatUser[] = [];
  displayMessages: ChatMessage[] = [];
  newMessage: boolean = false;
  showBox: boolean = false;
  @Input() isAdmin: boolean = false;
  userId: any = '';

  constructor(private socketService: SocketService, private authService: AuthService, private chatService: ChatService) {
    socketService.registerChatHandlers((event: any, data: any) => this.socketCallback(event, data))
  }

  ngOnInit() {
    if (!this.isAdmin) {
      this.currentUser = "admin";
    }
    this.userId = this.authService.getUserFromToken();
    this.getChatForUser(this.userId._id);
    //console.log("message1: "+ this.messages);
  }

  getChatForUser(userId: string) {
    this.chatService.getMessagesForUser(userId)
      .subscribe((chat: any) => {
        console.log("message: "+ chat);
        this.sender = chat.sender;
        this.receiver = chat.receiver;
        this.messages = chat.messages;
        this.filterMessages();
      })
  }

  sendMessage() {
    if (this.message) {
      let messageItem: { from: string; to: string; content: string } = { to: this.currentUser, content: this.message, from: "" };
      this.socketService.sendMessage(messageItem);
      let chatMessage: ChatMessage = {
        from: this.sender,
        to: this.receiver[0],
        content: this.message
      }
      this.messages.push(chatMessage);
      this.filterMessages();
      this.message = '';
    }
  }

  //cercare in this.receriver il current user asseganre a 58

  socketCallback(event: any, data: any) {
    if (event == 'newMessage') {
      if (this.isAdmin) {
        if (this.users.length == 0) {
          this.currentUser = data.from;
        }
        if (data.from != "admin" && !this.users.some(u => u.username === data.from)) {
          this.users.push({ username: data.from, newMessages: this.users.length > 0 });
        } else {
          let user = this.users.find(u => u.username === data.from);
          if (user) {
            user.newMessages = data.from != this.currentUser;
          }
        }
      }
      this.filterMessages();
    }
  }

  filterMessages() {
    this.displayMessages = this.messages.filter((m: ChatMessage) => m.to.username == this.currentUser || m.from.username == this.currentUser);

    if (this.users.length > 0) {
      const currentUser = this.users.find(u => u.username === this.currentUser);
      if (currentUser) {
        currentUser.newMessages = false;
      }
    }

    this.newMessage = this.users.some(u => u.newMessages);
  }

  deleteMessage() {
    let deleteId: string | undefined;
    if (this.sender && this.receiver) {
      if (this.userId === this.sender._id)
        deleteId = this.receiver._id;
      else
        deleteId = this.sender._id;

      if (deleteId) {
        this.chatService.deleteMessage(deleteId)
          .subscribe(() => {
            // Ricarica i messaggi mostrati solo se il messaggio è stato eliminato con successo
            this.filterMessages();
          });
      } else {
        console.error('Impossibile determinare l\'ID del destinatario per eliminare il messaggio');
      }
    } else {
      console.error('Messaggio non definito correttamente');
    }
  }

}
