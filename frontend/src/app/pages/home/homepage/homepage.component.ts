import { Component } from '@angular/core';
import { TestamonialComponent } from '../testamonial/testamonial.component';
import {HomefooterComponent} from '../../../shared/layout/homefooter/homefooter.component'

import {HomenavbarComponent} from '../../../shared/layout/homenavbar/homenavbar.component'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/users/user.service';
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TestamonialComponent,HomenavbarComponent,HomefooterComponent,ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

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
