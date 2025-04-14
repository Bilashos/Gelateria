import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock';
import { GeneralService } from './-general.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.apiUrl + "/api/stock"; // URL del server API per i movimenti di stock

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  // Metodo per ottenere i movimenti di stock in un intervallo di date
  getStocks(startDate?: string, endDate?: string): Observable<Stock[]> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<Stock[]>(`${this.apiUrl}/getStockMovements${queryParams}`, { headers });
  }

  // Metodo per ottenere le spese di stock raggruppate per data in un intervallo di date
  getStockExpensesGroupedByDate(startDate?: string, endDate?: string): Observable<Stock[]> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<Stock[]>(`${this.apiUrl}/getStockExpensesGroupedByDate${queryParams}`, { headers });
  }

  // Metodo per aggiungere un nuovo movimento di stock
  addStock(stock: Stock): Observable<Stock> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.post<Stock>(`${this.apiUrl}/insertStockMovements`, stock, { headers });
  }
}
