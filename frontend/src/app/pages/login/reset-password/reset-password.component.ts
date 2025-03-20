import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { RouterModule,Router } from '@angular/router';

import { ReactiveFormsModule , FormBuilder,FormControl,Validators,FormGroup} from '@angular/forms';
import { UserService } from '../../../core/services/users/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [AuthReviewCarouselComponent,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPassword:FormGroup
  constructor(private _user:UserService,private fb:FormBuilder,private _router:Router){

    let controls={
      email:new FormControl('',[Validators.required,Validators.email]),

      newPassword:new FormControl('',[Validators.required]),
      confirmPassword: ['', Validators.required]
      
    }
    this.resetPassword=this.fb.group(controls)

    


  }

  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  send(){
     this._user.resetPassword(this.resetPassword.value).subscribe({
      next:(res:any)=>{
          this._router.navigate(['/login'])
      },
      error:(err:any)=>{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });

      }
    })
     

  }


}
