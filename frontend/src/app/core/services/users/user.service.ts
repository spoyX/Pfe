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
byemail(email: any){
  return this.http.get(this.url + 'byemail/' + email);
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
checkVerificationCode(code:any,email:any){
  return this.http.post(this.url +'/checkVerificationCode',{code,email })

}
resetPassword(newPassword: any,email:any){
  return this.http.put(this.url + 'reset-password' , {newPassword,email})
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

alluser(){
  return this.http.get(this.url +'allusers')
}


searchUsers(query: string, field: string, country: string, status: string) {
  const params = new Map<string, string>();
  if (query) params.set('query', query);
  if (field) params.set('field', field);
  if (country) params.set('country', country);
  if (status) params.set('status', status);

  return this.http.get(`${this.url}/search`, { params: Object.fromEntries(params) });
}
}