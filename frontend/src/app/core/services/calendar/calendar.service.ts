import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private url = 'http://127.0.0.1:3000/api/calendar/'; 

  constructor(private http: HttpClient) { }

  getAllEvents() {
    return this.http.get(this.url +'getall')
  }

  createEvent(event: any) {
    return this.http.post(this.url +'create' , event)
  }

  updateEvent(event: any , id:any) {
    
    return this.http.put(this.url +'update/' + id ,event)
  }

  deleteEvent(id: any) {

    return this.http.delete(this.url +'delete/' + id)
  }

  getById(id: string) {
 
    return this.http.get(this.url +'byid'+id)
  }
}