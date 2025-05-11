import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { RouterModule,Router } from '@angular/router';

import { ReactiveFormsModule , FormBuilder,FormControl,Validators,FormGroup} from '@angular/forms';
import { UserService } from '../../../core/services/users/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-code-verfication',
  standalone: true,
  imports: [AuthReviewCarouselComponent,ReactiveFormsModule],
  templateUrl: './code-verfication.component.html',
  styleUrl: './code-verfication.component.css'
})
export class CodeVerficationComponent {
  codeForm:FormGroup
  data:any
  email:any
  errorMessage: string = '';
  constructor(private _user:UserService,private fb:FormBuilder,private _router:Router){

    let controls={
      code:new FormControl('',[Validators.required]),
      
    }
    this.codeForm=this.fb.group(controls)

    


  }
  ngOnInit(){
    this.email=localStorage.getItem("email")
    
  }
  
  
  send(){
    this._user.checkVerificationCode(this.codeForm.value.code,this.email).subscribe({
      next:(res:any)=>{
       
       
        this._router.navigate(['/reset-password'])

      },
      error:(err:any)=>{
    
        this.errorMessage = err?.error?.message || 'Invalid verification code. Please try again.';

      }
    })

  }

}
