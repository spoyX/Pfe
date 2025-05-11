import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder ,FormGroup ,FormControl ,Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/users/user.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  id: any;
  editForm: FormGroup;
  image: any;
  data: any;
  imagePreview: string | null = null;
  
  constructor(private fb: FormBuilder, private router: Router, private _user: UserService, private _auth: AuthentificationService) {
    let controls = {
      email: new FormControl('', [Validators.email]),
      username: new FormControl('', []),
      firstName: new FormControl('', []),
      lastName: new FormControl('', []),
      job: new FormControl('', []),
      aboutMe: new FormControl('', []),
      country: new FormControl('', []),
      city: new FormControl('', []),
      phone: new FormControl('', []),
      facebookLink: new FormControl('', []),
      instagramLink: new FormControl('', []),
      linkedinLink: new FormControl('', []),
    }
    this.editForm = this.fb.group(controls);
  }
  
  ngOnInit() {
    this.id = this._auth.getDataFromToken()._id;
    this._user.byid(this.id).subscribe({
      next: (res: any) => {
        this.data = res;
        this.editForm.reset(res.user);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.image = file;
      
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeImage() {
    this.image = null;
    this.imagePreview = null;
  }
  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  send() {
    if (this.editForm.valid) {
    
      const formData = new FormData();
      
      // Add all form fields to formData
      Object.keys(this.editForm.value).forEach(key  => {
        formData.append(key, this.editForm.get(key)?.value);
      });
      
      // Add image to formData if selected
      if (this.image) {
        formData.append('profileImage', this.image);
      }
      
      // Call service to update profile
      this._user.updateProfile(formData, this.id).subscribe({
        next: (res: any) => {
          // Show success alert
          Swal.fire({
            title: 'Profile Updated!',
            text: 'Your profile has been updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Navigate to profile view or refresh data after confirmation
            window.location.reload()
          });
        },
        error: (err: any) => {
          console.error('Error updating profile', err);
          // Show error alert
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while updating your profile. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
}
}