import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stock } from 'src/app/models/stock';
import { RawIngridientService } from 'src/app/services/raw-ingridient.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css'
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  allIngredients: any[] = []
  startDate?: string;
  endDate?: string;

  constructor(private stockService: StockService, private ingredientService: RawIngridientService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    
    this.ingredientService.getIngredients().subscribe((ingredients: any) => {
      this.allIngredients = ingredients;
      this.getStocks();
    })
    // Carica tutti i movimenti all'inizio

  }
  reciveMovimento(eseguito:boolean){
    if(eseguito)
      this.getStocks();
  }
  getStocks(): void {
    this.stockService.getStocks(this.startDate, this.endDate).subscribe(
      data => {
        this.stocks = data;
        console.log(data);
        
        this.stocks.forEach((stock:any)=>{
          const ingredient = this.allIngredients.find(ingredient => ingredient._id === stock.ingredientId);
          stock.ingredient = ingredient;
        })
        console.log(this.stocks);
        
      },
      error => {
        const message = 'Errore nel recupero dei movimenti';
        console.error(message, error);
        this._snackBar.open(message, 'Chiudi', {
          duration: 5 * 1000,
        });
      }
    );
  }
}