import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomenavbarComponent } from '../../shared/layout/homenavbar/homenavbar.component';
import { HomefooterComponent } from '../../shared/layout/homefooter/homefooter.component';
import { UserService } from '../../core/services/users/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HomenavbarComponent,HomefooterComponent,CommonModule,MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  personalForm: FormGroup;
  accountForm: FormGroup;
  additionalForm: FormGroup;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
    });
    this.accountForm = this.fb.group({
      
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.additionalForm = this.fb.group({
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      idDocument: [null, Validators.required]
    });
  }


  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.additionalForm.patchValue({ idDocument: this.selectedFile });
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      if(this.selectedFile){
        reader.readAsDataURL(this.selectedFile);
      }
      
    }
  }

  onSubmit(): void {
    // Check if all steps are valid
    if (this.personalForm.valid && this.accountForm.valid && this.additionalForm.valid) {
      const formData = new FormData();
      const personalData = this.personalForm.value;
      const accountData = this.accountForm.value;
      const additionalData = this.additionalForm.value;

      // Append fields from all groups
      Object.keys(personalData).forEach(key => formData.append(key, personalData[key]));
      Object.keys(accountData).forEach(key => formData.append(key, accountData[key]));
      Object.keys(additionalData).forEach(key => {
        if (key === 'idDocument' && this.selectedFile) {
          formData.append('idType', this.selectedFile);
        } else {
          formData.append(key, additionalData[key]);
        }
      });

      this.userService.signup(formData).subscribe({
        next: (res: any) => {
          console.log('User account created successfully', res);
          localStorage.setItem('userId', res.user._id);
          this.router.navigate(['/subscription-plan']);
        },
        error: (err: any) => {
          console.error('Error creating user account', err);
        }
      });
    }
  }
}