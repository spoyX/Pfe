import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://127.0.0.1:3000/api/user/';

  constructor(private http:HttpClient) { }


signup(data:any){
  return this.http.post(this.url +'createuseraccount',data)
}  

signin(data: any) {
  return this.http.post(this.url + 'signin', data);
}
byid(id: any){
  return this.http.get(this.url + 'byid/' + id);
}
updateProfile(data:any,id:any){
  return this.http.put(this.url +'updateprofile/' + id , data)
}



}