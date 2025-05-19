import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EventService } from '../../../../core/services/event/event.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule, 
    ProgressBarModule,
    MatPaginatorModule
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventDetailsComponent implements OnInit, AfterViewInit {
  // Event details properties
  eventDetails: any;
  id: any;
  registrationDeadline: any;
  daysLeft: any;
  today = new Date();
  progressValue: any;
  progressSpots: any;

  // Pagination properties
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageIndex = 0;
  displayedRegistrations: any[] = [];
  totalRegistrations = 0;

  // Progress bar properties
  height: string = '40px';
  width: string = '100%';
  labelDisplayType: string = 'Inside';
  trackColor: string = '#E0E0E0';
  progressColor: string = '#48bb78';
  progressSpotColor: string = '#ecc94b';
  cssClass: string = 'custom-progress-bar';

  constructor(private _event: EventService, private _act: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this._act.snapshot.params['id'];
    this.loadEventDetails();
  }

  ngAfterViewInit(): void {
    // If we have data before paginator initializes
    if (this.paginator && this.eventDetails) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPageChange(event);
      });
    }
  }

  loadEventDetails(): void {
    this._event.getEventById(this.id).subscribe((res: any) => {
      this.eventDetails = res;
      this.calculateRegistrationDeadline();
      this.calculateDaysLeft();
      
      // Calculate progress bar values
      this.progressValue = Math.round((this.eventDetails.registrations.length / this.eventDetails.maxParticipants) * 100);
      this.progressSpots = Math.round((this.eventDetails.maxParticipants - this.eventDetails.registrations.length));
      
      // Initialize pagination
      this.totalRegistrations = this.eventDetails.registrations?.length || 0;
      this.updateDisplayedRegistrations();
      
      // Update paginator if it's already available
      if (this.paginator) {
        this.paginator.length = this.totalRegistrations;
        this.paginator.pageIndex = this.pageIndex;
      }
    });
  }

  calculateRegistrationDeadline(): void {
    if (this.eventDetails) {
      this.registrationDeadline = new Date(this.eventDetails.date);
      this.registrationDeadline.setDate(this.registrationDeadline.getDate() - 1);
      this.daysLeft = this.calculateDaysLeft();
    }
  }

  calculateDaysLeft(): number {
    const diffTime = this.registrationDeadline.getTime() - this.today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Pagination handler
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedRegistrations();
  }

  // Update displayed registrations based on current pagination settings
  updateDisplayedRegistrations(): void {
    if (this.eventDetails && this.eventDetails.registrations) {
      const startIndex = this.pageIndex * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.displayedRegistrations = this.eventDetails.registrations.slice(startIndex, endIndex);
    }
  }
}