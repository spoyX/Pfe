import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  url='http://127.0.0.1:3000/api/event/';

  constructor(private http:HttpClient) { }



  createEvent(data:any){
    return this.http.post(this.url+'create',data);
  }

  getall(){
    return this.http.get(this.url+'getall');
  }

  deleteEvent(id:any){
    return this.http.delete(this.url+'delete/'+id);
  }
  updateEvent(data:any,id:any){
    return this.http.put(this.url+'update/'+id,data);
  }
  getEventById(id:any){
    return this.http.get(this.url+'byid/'+id);
  }


  getAllEvents(filters: any): any {
    const queryParams = new URLSearchParams();
    if (filters.title) queryParams.set('title', filters.title);
    if (filters.categories) queryParams.set('categories', filters.categories);
    if (filters.date) queryParams.set('date', filters.date);

    return this.http.get(`${this.url}/getall?${queryParams.toString()}`);
  }

  registre(idEvent:any){
    return this.http.post(this.url+'registre/'+idEvent,{});

  }
}
