import { Component } from '@angular/core';
import { RouterLinkActive , RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { UserService } from '../../../../core/services/users/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
   id:any
   data:any
   
  constructor(private _auth :AuthentificationService , private _user:UserService){
    

  }
  ngOnInit(){

    
    this.id=this._auth.getDataFromToken()._id
    this._user.byid(this.id).subscribe({
      next: (res: any)=>{
        this.data=res

       
        
    
      
      }
    })
  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('membershipStatus');
    window.location.reload()
  }

}
