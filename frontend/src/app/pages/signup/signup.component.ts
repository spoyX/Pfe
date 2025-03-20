import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomenavbarComponent } from '../../shared/layout/homenavbar/homenavbar.component';
import { HomefooterComponent } from '../../shared/layout/homefooter/homefooter.component';
import { UserService } from '../../core/services/users/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HomenavbarComponent,HomefooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signForm: FormGroup;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    // Define the form controls as an object
    const controls = {
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required]
    };

    // Create the form group using the controls object
    this.signForm = this.fb.group(controls);
  }

  ngOnInit(): void {}

  // Handle file input change and create a preview
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
      
    }
  }

  // Submit form and pass data to the signup function
  onSubmit(): void {
    if (this.signForm.valid) {
      const formData = new FormData();
      // Append all form fields to FormData
      Object.keys(this.signForm.value).forEach(key => {
        formData.append(key, this.signForm.value[key]);
      });
      // Append the file if selected
      if (this.selectedFile) {
        formData.append('idType', this.selectedFile);
      }

      // Call the user service signup method
      this.userService.signup(formData).subscribe({
        next: (res: any) => {
          console.log('User account created successfully', res);
          localStorage.setItem('userId', res.user._id);

          this.router.navigate(['/subscription-plan']);
        },
        error: (err:any) => {
          console.error('Error creating user account', err);
        }
      });
    }
  }
}