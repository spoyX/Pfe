import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule , FormBuilder,FormControl,Validators,FormGroup} from '@angular/forms';
import {UserService} from '../../core/services/users/user.service';
import {AuthentificationService} from '../../core/auth/authentification.service'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthReviewCarouselComponent,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm:FormGroup
  constructor(private _user:UserService,private fb:FormBuilder,private _router:Router,private _auth:AuthentificationService){

    let controls={
      email:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',[Validators.required])
    }
    this.loginForm=this.fb.group(controls)

    


  }


  login(){

    this._user.signin( this.loginForm.value ).subscribe({
      
      next: (res: any)=>{
        
        
       
        localStorage.setItem('token', res.myToken);
        if(this._auth.getDataFromToken().role =='admin'){
          this._router.navigate(['/admin']);

        }
        else{
          this._router.navigate(['/member']);

        }
        
      
          

        
        
      

      },
      error: (err:any)=>{
        
        
      }
    })

  }

}
