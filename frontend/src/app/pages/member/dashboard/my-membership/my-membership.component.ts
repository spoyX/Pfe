import { Component } from '@angular/core';
import { MembershipService } from '../../../../core/services/memberships/membership.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-membership',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-membership.component.html',
  styleUrl: './my-membership.component.css'
})
export class MyMembershipComponent {
 data:any
 id:any
 daysRemaining: number = 0;
 progressPercentage: number = 0;
 canRenew: boolean = false;
  constructor(private _membership:MembershipService,private _auth:AuthentificationService ){

  }
  
  ngOnInit(){
    this.id=this._auth.getDataFromToken()._id
    this._membership.getById(this.id).subscribe({
      next:(res:any)=>{
        this.data=res
        this.calculateProgress(this.data.startDate, this.data.endDate);
       const today = new Date();
       const endDate = new Date(res.endDate);
 
       const diffTime = endDate.getTime() - today.getTime();
       this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       this.canRenew = this.daysRemaining <= 10 && this.daysRemaining >= 0;

      },
      error:(err:any)=>{
       console.log(err);
       
      }
    })
  }
  calculateProgress(startDateStr: string, endDateStr: string) {
    const today = new Date();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
  
    const totalDuration = endDate.getTime() - startDate.getTime();
    const timePassed = today.getTime() - startDate.getTime();
  
    const progress = (timePassed / totalDuration) * 100;
    
    this.progressPercentage = Math.min(Math.max(progress, 1), 100);
  }
 

}

  


