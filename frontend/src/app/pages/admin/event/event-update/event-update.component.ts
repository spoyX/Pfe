import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ActivatedRoute, Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from '../../../../core/services/event/event.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-event-update',
  standalone: true,
  imports: [MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,         
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './event-update.component.html',
  styleUrl: './event-update.component.css',
  providers: [provideNativeDateAdapter()],
})
export class EventUpdateComponent {
  basicInfoForm: FormGroup;
    detailsForm: FormGroup;
    mediaForm: FormGroup;
    previewForm: FormGroup;
    selectedFile: File | null = null;
    filePreview: string | ArrayBuffer | null = null;
    existingImageUrl: string | null = null;
    existingImageName: string | null = null;
    id:any
  
    constructor(
      private fb: FormBuilder,
      private _event: EventService,
      private router: Router,
      private _activatedRoute: ActivatedRoute
    ) {
      this.basicInfoForm = this.fb.group({
        title: ['', Validators.required],
        categories: ['', Validators.required],
        date: ['', Validators.required],
        startTime: ['', Validators.required],
        location: ['', Validators.required]
      });
  
      this.detailsForm = this.fb.group({
        description: ['', Validators.required],
        maxParticipants: ['', Validators.required],
        status: ['', Validators.required]
      });
  
      this.mediaForm = this.fb.group({
        coverImage: ['',]
      });
  
      this.previewForm = this.fb.group({});
    }
  
    onFileChange(event: any): void {
      if (event.target.files && event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
        this.mediaForm.patchValue({ coverImage: this.selectedFile });
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreview = reader.result;
        };
        if (this.selectedFile) {
          reader.readAsDataURL(this.selectedFile);
        }
      }
    }
  ngOnInit() {
    this.id = this._activatedRoute.snapshot.paramMap.get('id');

    this._event.getEventById(this.id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.basicInfoForm.patchValue({
          title: res.title,
          categories: res.categories,
          date: res.date,
          startTime: res.startTime,
          location: res.location
        });
        
        this.detailsForm.patchValue({
          description: res.description,
          maxParticipants: res.maxParticipants,
          status: res.status
        });
        
        // Store the existing image URL and set it as the preview
        if (res.coverImage) {
            this.existingImageName = res.coverImage;
          this.existingImageUrl = "http://127.0.0.1:3000/files/"+ res.coverImage;
          this.filePreview = this.existingImageUrl;
        }
      },
      error: (err: any) => {
        console.error('Error fetching event data', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again.'
        });
      }
    });
  }

    onSubmit(): void {
    if (
      this.basicInfoForm.valid &&
      this.detailsForm.valid
    ) {
      const formData = new FormData();
      const basicInfo = this.basicInfoForm.value;
      const details = this.detailsForm.value;
      
      // Add all basic info and details to FormData
      Object.keys(basicInfo).forEach(key => formData.append(key, basicInfo[key]));
      Object.keys(details).forEach(key => formData.append(key, details[key]));
      
      // Handle image - if new file is selected, use it, otherwise pass the existing image name
      if (this.selectedFile) {
        formData.append('coverImage', this.selectedFile);
      } else if (this.existingImageName) {
        // Add a flag or the existing image name to tell the backend to keep the existing image
        formData.append('existingImage', this.existingImageName);
      }
      
      // Update the event
      this._event.updateEvent(formData, this.id).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Event updated successfully!'
          });
          this.router.navigate(['admin/event-list']);
        },
        error: (err: any) => {
          console.error('Error updating event', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An unexpected error occurred. Please try again.'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
    }
  }
}