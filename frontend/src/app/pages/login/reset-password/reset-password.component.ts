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
  resetPassword: FormGroup;
  email: any;

  constructor(
    private _user: UserService,
    private fb: FormBuilder,
    private _router: Router
  ) {
    this.resetPassword = this.fb.group({
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit() {
    this.email = localStorage.getItem("email");
  }

  // Custom validator to check password match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    return newPassword && confirmPassword && newPassword.value === confirmPassword.value 
      ? null 
      : { mismatch: true };
  }

  send() {
  
      const newPassword = this.resetPassword.value.newPassword;
      this._user.resetPassword(newPassword, this.email)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Password Reset",
              text: "Your password has been successfully reset!"
            });
            this._router.navigate(['/login']);
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Reset Failed",
              text: err.message || "Something went wrong during password reset."
            });
          }
        });
    } 
  }
