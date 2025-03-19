import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/users/user.service';
import { AuthentificationService } from '../../../core/auth/authentification.service';
@Component({
  selector: 'app-gestion-profile',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './gestion-profile.component.html',
  styleUrl: './gestion-profile.component.css'
})
export class GestionProfileComponent {
  data:any
    id:any
  constructor(private router: Router ,private _user:UserService,private _auth:AuthentificationService) {}

  

  ngOnInit(){
    this.id=this._auth.getDataFromToken()._id
    this._user.byid(this.id).subscribe({
      next: (res: any)=>{
        this.data=res
        
      }
    })

  }
  isActiveRoute(route: string): boolean {
    return this.router.isActive(`./${route}`, true);
  }

}
