import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private url = 'http://127.0.0.1:3000/api/payments/';

  constructor(private http: HttpClient) {}


  createCheckoutSession(userId: string, amount: number){
    return this.http.post(this.url+'checkout',{userId,amount})

  }


  confirmPayment(sessionId: string){
    return this.http.post(this.url + 'confirm', { sessionId: sessionId });
  }
}
