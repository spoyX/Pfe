import { Component} from '@angular/core';
import { EventService } from '../../../core/services/event/event.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  data: any
  searchForm: FormGroup;
  searchTimeout: any;
  
  // Pagination properties
  pageSize = 6; // Number of items per page
  pageSizeOptions = [3, 6, 9, 12]; // Options for page size
  pageIndex = 0; // Current page index
  allEvents: any[] = []; // Store all events for client-side pagination
  
  constructor(private _event: EventService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      title: [''],
      categories: [''],
      date: [''],
    });
  }
  
  ngOnInit() {
    this.loadEvents();
    
    // Subscribe to form value changes for real-time filtering with debounce time
    this.searchForm.valueChanges.subscribe(() => {
      // Using setTimeout to debounce the input (300ms)
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.loadEvents();
        this.pageIndex = 0; // Reset to first page when filters change
        this.updatePaginatedData();
      }, 300);
    });
  }
  
  loadEvents(): void {
    this._event.getAllEvents(this.searchForm.value).subscribe({
      next: (res: any) => {
        this.allEvents = res;
        this.updatePaginatedData();
      },
      error: (err: any) => {
        console.error('Error loading events', err);
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
    this.pageIndex = 0; // Reset to first page
    this.loadEvents();
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
}