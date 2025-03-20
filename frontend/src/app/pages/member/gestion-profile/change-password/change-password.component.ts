import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder ,FormGroup ,FormControl ,Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/users/user.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  userId: any;
  currentPasswordIncorrect: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthentificationService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.userId = this.authService.getDataFromToken()._id;
  }

  // Custom validator to ensure newPassword and confirmPassword match
  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.userService.changePassword(this.passwordForm.value, this.userId).subscribe({
        next: (res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });
      
        
        },
        error: (err) => {
          console.error('Error updating password', err);
          this.currentPasswordIncorrect = true;
          document.getElementById('currentPassword')?.focus();
        }
      });
    }
  }
}