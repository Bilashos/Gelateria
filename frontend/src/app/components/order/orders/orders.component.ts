import { Component, Input, OnInit } from '@angular/core';

import { Order, Status } from "../../../models/order";
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})

export class OrdersComponent implements OnInit {
  ordersAll: Order[] = [];
  ordersFiltered: Order[] = [];
  orderToShow: Order[] = [];
  utentiEmail: any[] = [];
  utentiUsername: any[] = [];
  userIdSearch: string = "";
  idOrderToSearch = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;
  // per gestire il paginator
  pageEvent: PageEvent | undefined;
  length = 50;
  pageSize = 9;
  pageIndex = 0;
  pageSizeOptions = [6, 9, 18, 27];

  constructor(private orderService: OrderService, private userService: UserService) { }
  ngOnInit(): void {
    this.getOrders();

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  getOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.ordersAll = orders;
      this.setOrderVariable();
      this.setUsers();
      this.filteredOptions = this.idOrderToSearch.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    });
  }
  setOrderVariable(isFiltered: boolean = false) {
    if (!isFiltered) {
      this.ordersFiltered = this.ordersAll;
    }
    else {
      if (this.userIdSearch != "") {
        this.ordersFiltered = this.ordersAll.filter(order => order.user === this.userIdSearch);
      }
      if (this.idOrderToSearch.value != "") {
        this.ordersFiltered = this.ordersAll.filter(order => order._id === this.idOrderToSearch.value);
      }
    }
    let elementi = this.pageSize
    
    
    if((this.pageIndex + 1) * this.pageSize > this.ordersFiltered.length){
      elementi = (this.ordersFiltered.length - this.pageIndex * this.pageSize)
      
    }
    console.log(elementi, this.pageIndex * this.pageSize, elementi);
    
    this.orderToShow = this.ordersFiltered.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize)+elementi)

  }
  setUsers() {
    const uniqueUsers = Array.from(new Set(this.ordersAll.map(order => order.user)));
    const uniqueIds = Array.from(new Set(this.ordersAll.map(order => order._id)));
    if (uniqueIds != undefined) {
      const stringArray: string[] = uniqueIds.filter((value: string | undefined): value is string => value !== undefined);
      this.options = stringArray;
    }
    console.log(uniqueUsers);
    uniqueUsers.forEach(userId => {
      this.userService.getUserById(userId).subscribe(user => {
        this.utentiEmail.push({ key: userId, value: user.email });
        this.utentiUsername.push({ key: userId, value: user.username });
      });
    });
  }
  filterOrder() {
    console.log(this.userIdSearch, this.idOrderToSearch.value);
    this.pageIndex = 0;
    const isFIltered = this.userIdSearch != "" || this.idOrderToSearch.value != "";
    this.setOrderVariable(isFIltered);
    
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    const isFIltered = this.userIdSearch != "" || this.idOrderToSearch.value != "";
    this.setOrderVariable(isFIltered);

  }
}
