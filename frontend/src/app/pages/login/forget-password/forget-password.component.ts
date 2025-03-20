import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { RouterModule,Router } from '@angular/router';

import { ReactiveFormsModule , FormBuilder,FormControl,Validators,FormGroup} from '@angular/forms';
import { UserService } from '../../../core/services/users/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [AuthReviewCarouselComponent,RouterModule,ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  forgotPassword:FormGroup
  constructor(private _user:UserService,private fb:FormBuilder,private _router:Router){

    let controls={
      email:new FormControl('',[Validators.required,Validators.email]),
      
    }
    this.forgotPassword=this.fb.group(controls)

    


  }
  send(){
    this._user.forgotPassword(this.forgotPassword.value).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: "email sent!",
          icon: "success",
          draggable: true
        });
        this._router.navigate(['/code-verfication'])
        
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
