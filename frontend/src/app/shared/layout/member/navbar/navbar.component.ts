import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../../../../core/auth/authentification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
   
   data:any
  constructor(private _auth :AuthentificationService){
    

  }
  ngOnInit(){
  this.data=this._auth.getDataFromToken()
  }


  logout(){
    localStorage.removeItem('token')
    window.location.reload()
  }

}
