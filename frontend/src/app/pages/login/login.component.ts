import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule , FormBuilder,FormControl,Validators,FormGroup} from '@angular/forms';
import {UserService} from '../../core/services/users/user.service';
import {AuthentificationService} from '../../core/auth/authentification.service'
import Swal from 'sweetalert2';

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


  login(event: Event) {
    event.preventDefault();
    this._user.signin(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.removeItem('membershipStatus');
        localStorage.setItem('token', res.myToken);
        const role = this._auth.getDataFromToken().role;
      
  
        if (role === 'admin') {
          this._router.navigate(['/admin']);
        } else {
          this._router.navigate(['/member']);
        }
      },
  
      error: (err: any) => {
        let errorMessage = '';
  
        if (err.status === 403) {
          if (err.error.message.includes('expired')) {
            errorMessage = '⏰ Your membership has expired. Please renew to access your account.';
            if (err.error.userId) {
              localStorage.setItem('userId', err.error.userId);
            }
            localStorage.setItem('membershipStatus', 'expired');

            
            // Show alert then navigate
            Swal.fire({
              icon: 'warning',
              title: 'Membership Expired',
              text: errorMessage,
              confirmButtonColor: '#d33',
              confirmButtonText: 'Renew Now'
            }).then(() => {
              this._router.navigate(['/expired']); 
            });
  
            return; // exit to avoid showing another alert
          } else if (err.error.message.includes('not active')) {
            errorMessage = '🚫 Your account is not active. Please check your email or contact support.';
          } else {
            errorMessage = '🚫 Access forbidden. Please contact support.';
          }
        } 
        else if (err.status === 401) {
          errorMessage = '❌ Invalid email or password. Please try again.';
        } 
        else {
          errorMessage = '⚠️ Something went wrong. Please try again later.';
        }
  
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: errorMessage,
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    });
  }

}