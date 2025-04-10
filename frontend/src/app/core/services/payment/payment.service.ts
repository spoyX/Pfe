import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private url = 'http://127.0.0.1:3000/api/payments/';

  constructor(private http: HttpClient) {}


  createCheckoutSession(userId: string, amount: number){
    return this.http.post(this.url+'checkout',{userId,amount})

  }
  expiredMembership(userId: string, amount: number){
    return this.http.post(this.url+'checkout-expired',{userId,amount})

  }


  confirmPayment(sessionId: string){
    return this.http.post(this.url + 'confirm', { sessionId: sessionId });
  }
  confirm(sessionId: string){
    return this.http.post(this.url + 'confirm-expired', { sessionId: sessionId });
  }

  getPayment(){
    return this.http.get(this.url+ 'allpayments')
   }
   byId(id:any){
    return this.http.get(this.url +'byId/' +id)

   }



   validate(paymentId: string, body: any): Observable<any> {
    return this.http.post(`${this.url}validate/${paymentId}`, body);
  }

  paymentHistory(id:any){
    return this.http.get(this.url+'history/'+id)

  }
}
