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
  code:FormGroup
  constructor(private _user:UserService,private fb:FormBuilder,private _router:Router){

    let controls={
      code:new FormControl('',[Validators.required]),
      
    }
    this.code=this.fb.group(controls)

    


  }
  send(){
    this._user.checkVerificationCode(this.code.value).subscribe({
      next:(res:any)=>{

        this._router.navigate(['/reset-password'])

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
