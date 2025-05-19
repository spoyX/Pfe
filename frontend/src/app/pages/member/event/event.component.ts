import { Component, ViewChild } from '@angular/core';
import { EventService } from '../../../core/services/event/event.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { AuthentificationService } from '../../../core/auth/authentification.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatPaginatorModule,
    MatButtonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  data: any // Paginated data to display
  allEvents: any[] = []; // Store all events for client-side pagination
  searchForm: FormGroup;
  searchTimeout: any;
  isLoading = true;
  user:any
  today = new Date();
 deadline:boolean = false;
  daysLeft: number = 0;
  pageSize = 6; // Number of items per page
  pageSizeOptions = [3, 6, 9, 12]; // Options for page size
  pageIndex = 0; // Current page index
   registrationDeadline: any;
  constructor(private _event: EventService, private fb: FormBuilder,private _auth:AuthentificationService) {
    this.searchForm = this.fb.group({
      title: [''],
      categories: [''],
      date: [''],
    });
  }
  
  ngOnInit() {
    this.user = this._auth.getDataFromToken()._id
  
  
   
    this.loadEvents();
    
    // Subscribe to form value changes for real-time filtering with debounce time
    this.searchForm.valueChanges.subscribe(() => {
      // Using setTimeout to debounce the input (300ms)
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.pageIndex = 0; // Reset to first page when filters change
        this.loadEvents();
      }, 300);
    });
   
  }
  
  loadEvents(): void {
    this.isLoading = true;
    this._event.getAllEvents(this.searchForm.value).subscribe({
      next: (res: any) => {
        this.allEvents = res; // Store all events from the API
        this.updatePaginatedData(); // Update the paginated view
        this.isLoading = false;

      },
      error: (err: any) => {
        console.error('Error loading events', err);
        this.isLoading = false;
        // Only show error for network failures, not for empty results
        if (err.status !== 200) {
          Swal.fire('Error', 'Unable to load events. Please try again later.', 'error');
        }
      }
    });
  }
  
  // Method to clear all filters
  clearFilters(): void {
    this.searchForm.reset({
      title: '',
      categories: '',
      date: ''
    });
    this.pageIndex = 0; 
    this.loadEvents();
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
  deleteEvent(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this event? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._event.deleteEvent(id).subscribe({
          next: (res) => {
            console.log(res);
            Swal.fire('Deleted!', 'The event has been deleted.', 'success');
            this.loadEvents();
          },
          error: (err) => {
            console.log(err);
            Swal.fire('Error!', 'An error occurred while deleting the event.', 'error');
          }
        });
      }
    });
  }
  
  // Handle page change events
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedData();
  }
  
  // Update displayed data based on current page and page size
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.data = this.allEvents.slice(startIndex, endIndex);
  }
  
  // Calculate total number of events for display
  get totalEvents(): number {
    return this.allEvents.length;
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
    return registrations.some(registration => registration.user === userId);

  }
  
}