import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../../../core/services/event/event.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthentificationService } from '../../../../core/auth/authentification.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  id: any;
  data: any;
  progressSpots: any;
  registrationDeadline: any;
  daysLeft: number = 0;
  hoursLeft: number = 0;
  minutesLeft: number = 0;
  secondsLeft: number = 0;
  today = new Date();
  intervalId: any;
  eventDate: Date | null = null;
  user:any
 deadline:boolean = false;
 

  constructor(private _event: EventService, private _act: ActivatedRoute,private _auth:AuthentificationService) {}

  ngOnInit(): void {
   
    this.user = this._auth.getDataFromToken()._id
    this.id = this._act.snapshot.params['id'];
    this._event.getEventById(this.id).subscribe({
      next: (res: any) => {
        this.data = res;
        console.log(this.data);
        this.progressSpots = Math.round((this.data.maxParticipants - this.data.registrations.length));

        
        // Set the event date
        this.eventDate = new Date(this.data.date);
        
        // Calculate registration deadline
        this.calculateRegistrationDeadline();
        
        // Start the countdown timer
        this.startCountdown();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
 
    
    
    
    
  }

  ngOnDestroy(): void {

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  calculateRegistrationDeadline(): void {
    if (this.data) {
      this.registrationDeadline = new Date(this.data.date);
      this.registrationDeadline.setDate(this.registrationDeadline.getDate() - 1);
    
      this.daysLeft = this.calculateDaysLeft();
      const now = new Date();
      
      // Check if registration deadline has passed
      if (now >= this.registrationDeadline) {
        this.deadline = true;

    }
  }
}

  calculateDaysLeft(): number {
    const diffTime = this.registrationDeadline.getTime() - this.today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  startCountdown(): void {
    // Update the countdown immediately once
    this.updateCountdown();
    
    // Then update it every second
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }


  updateCountdown(): void {
    if (!this.eventDate) return;
    
    const now = new Date().getTime();
    const eventTime = this.eventDate.getTime();
    const timeLeft = eventTime - now;
    
    if (timeLeft <= 0) {
      // Event has passed
      this.daysLeft = 0;
      this.hoursLeft = 0;
      this.minutesLeft = 0;
      this.secondsLeft = 0;
      clearInterval(this.intervalId);
      return;
    }
    
    // Calculate days, hours, minutes, and seconds
    this.daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    this.hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Update the DOM elements with the new values
    this.updateCountdownDisplay();
  }

  updateCountdownDisplay(): void {
    // Get the array of paragraph elements in the 'times' div
    const timesElements = document.querySelectorAll('.count-down-timer .times p');
    
    if (timesElements.length >= 4) {
      // Update each element with the corresponding value
      timesElements[0].textContent = this.daysLeft.toString();
      timesElements[1].textContent = this.hoursLeft.toString().padStart(2, '0');
      timesElements[2].textContent = this.minutesLeft.toString().padStart(2, '0');
      timesElements[3].textContent = this.secondsLeft.toString().padStart(2, '0');
    }
  }
  registre(idEvent: any) {
     this._event.registre(idEvent).subscribe({
       next: (res) => {
         console.log(res);
         Swal.fire('Success!', 'You have successfully registered for the event.', 'success');
         this.ngOnInit()
       },
       error: (err) => {
         console.log(err);
         if (err.status === 400 && err.error.message.includes('Event is full')) {
           Swal.fire({
             icon: 'error',
             title: 'Registration Failed',
             text: 'Sorry, this event is already full.'
           });
         } else if (err.status === 401 && err.error.message.includes('Registration deadline has passed')) {
           Swal.fire({
             icon: 'error',
             title: 'Registration Failed',
             text: 'Sorry, the registration deadline has passed.'
           });
         } else if (err.status === 403 && err.error.message.includes('User already registered')) {
           Swal.fire({
             icon: 'error',
             title: 'Registration Failed',
             text: 'You are already registered for this event.'
           });
         } else {
           Swal.fire('Error!', 'An error occurred while registering for the event.', 'error');
         }
       }
     });
   }
   isUserRegistered(registrations: any[]): boolean {
     const userId = this.user; 
     return registrations.some(registration => registration.user._id === userId);
   
   }
}