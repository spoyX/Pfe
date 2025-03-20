import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/users/user.service';
import { AuthentificationService } from '../../../core/auth/authentification.service';

@Component({
  selector: 'app-homenavbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './homenavbar.component.html',
  styleUrl: './homenavbar.component.css'
})
export class HomenavbarComponent {
  role:any
  constructor(public _user:UserService,public _auth:AuthentificationService){
   
  }
  


}
