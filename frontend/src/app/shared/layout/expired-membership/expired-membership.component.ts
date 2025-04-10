import { Component } from '@angular/core';
import {MembershipService} from '../../../core/services/memberships/membership.service'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-expired-membership',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './expired-membership.component.html',
  styleUrl: './expired-membership.component.css'
})
export class ExpiredMembershipComponent {
  id:any
  data:any
  constructor(private _membership:MembershipService){}



  ngOnInit(){
    this.id=localStorage.getItem('userId')
    this._membership.getById(this.id).subscribe({
      next:(res:any)=>{
        this.data=res
        
      },
      error:(err:any)=>{
           console.log(err)
      }
    })

  }

}
