import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private url = 'http://127.0.0.1:3000/api/membership/';


  constructor(private http: HttpClient) { }


  getById(id:any){
    return this.http.get(this.url +'byId/'+ id)
  }
}
