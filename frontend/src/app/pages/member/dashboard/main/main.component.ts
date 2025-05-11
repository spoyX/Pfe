import { Component } from '@angular/core';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { UserService } from '../../../../core/services/users/user.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event/event.service';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars'
import { MembershipService } from '../../../../core/services/memberships/membership.service';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import {  RouterLink } from '@angular/router';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,CalendarModule,RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  captions: string[] = [
    "Building bridges between Canadian and Tunisian businesses for mutual prosperity.",
    "Empowering entrepreneurs to thrive in global markets.",
    "Connecting cultures through innovation and collaboration.",
    "Driving economic growth with sustainable partnerships.",
    "Unlocking opportunities for cross-border success."
  ];

  currentCaptionIndex: number = 0; // Track the current caption index
  intervalId: any; // To store the interval ID
  id:any
  data:any
  event:any
  upcomingEvents:any
  history:any
  membership:any
 firstPayment:any
 totalAmount:any
 events:any
  
  constructor(private _auth:AuthentificationService,private _user:UserService,private _event:EventService, private _membership:MembershipService,private _payment:PaymentService){}

  ngOnInit(): void {
   this.id=this._auth.getDataFromToken()._id
    this._user.byid(this.id).subscribe({
      next:(res:any)=>{
        this.data=res
      
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
    this._event.getEventsWihoutFilter().subscribe({
      next:(res:any)=>{
        this.event=res
        this.upcomingEvents= this.event.filter((event: any) => event.status === 'upcoming');
       
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
    this._payment.paymentHistory(this.id).subscribe({
      next:(res:any)=>{
        this.history=res
        if (this.history && this.history.length > 0) {
          this.firstPayment = this.history[0];
          this.totalAmount = this.history.reduce((sum: number, history: any) => sum + history.amount, 0);
        }
      
        
  
      },
      error:(err:any)=>{ 
        console.log(err);
        
  
      }
  
     })
      this._membership.getById(this.id).subscribe({
        next:(res:any)=>{
          this.membership=res
          
        },
        error:(err:any)=>{
          console.log(err);
        }
      })
      this._event.getEventbyUser().subscribe({
        next:(res:any)=>{
          this.events=res
          console.log(this.events);
          
          
        },
        error:(err:any)=>{
          console.log(err);
        }
      })
    this.startSliding();
  }

  ngOnDestroy(): void {
    
    clearInterval(this.intervalId);
  }

  startSliding(): void {
    // Change the caption every 5 seconds (5000ms)
    this.intervalId = setInterval(() => {
      this.currentCaptionIndex = (this.currentCaptionIndex + 1) % this.captions.length;
    }, 5000);
  }
}