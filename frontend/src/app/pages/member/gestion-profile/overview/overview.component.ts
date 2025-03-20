import { Component } from '@angular/core';
import { UserService } from '../../../../core/services/users/user.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  data:any
    id:any
  constructor( private _user:UserService, private _act: ActivatedRoute,private _auth:AuthentificationService) {}

  

  ngOnInit(){
    this.id=this._auth.getDataFromToken()._id
    this._user.byid(this.id).subscribe({
      next: (res: any)=>{
        this.data=res
    
      
      }
    })

  }

}
