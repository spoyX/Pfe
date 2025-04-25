import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

 
    private url = 'http://localhost:3000/api/notifications/';
  
    constructor(private http: HttpClient) { }
  
    getUnreadNotifications(userId: any) {
      return this.http.get(this.url + 'user/'+ userId );
    }
  
    markAsRead(id: string) {
      return this.http.put(`${this.url}/${id}/read`, {});
    }
  }
