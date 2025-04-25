import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/users/user.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
   contactForm: FormGroup;
  
    constructor(private fb: FormBuilder ,private _user:UserService) {
      this.contactForm = this.fb.group({
        // Personal Information
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        
        // Professional Information
        company: [''],
        jobTitle: [''],
        
        // Contact Information
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        country: ['', Validators.required],
        
        // Message
        subject: ['', Validators.required],
        message: ['', Validators.required]
      });
    }
  send(){
    this._user.sendContact(this.contactForm.value).subscribe({
      next:(res:any)=>{
  
      },
      error:(err:any)=>{
        
      }
    })
  
  }
  }


