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
changePassword(data:any,id:any){
  return this.http.put(this.url + 'changepassword/'+id ,data)
}
forgotPassword(data:any){
  return this.http.post(this.url + 'forgot-password' ,data )

}
checkVerificationCode(data:any){
  return this.http.post(this.url +'/checkVerificationCode',data)

}
resetPassword(data:any){
  return this.http.put(this.url + 'reset-password' , data)
}

isLoggedIn(){
  let token = localStorage.getItem('token');

  if(token){
    return true;
  }else{
    return false;
  }
}
sendContact(data:any){
  return this.http.post(this.url +'contact',data)
}
}