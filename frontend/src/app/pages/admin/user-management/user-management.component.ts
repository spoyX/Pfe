import { Component } from '@angular/core';
import { UserService } from '../../../core/services/users/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  data:any
  query = '';
  field: 'username' | 'firstName' | 'lastName' | 'country' | 'status' | '' = '';
  country = '';
  status: 'active' | 'inactive' | 'expired' | '' = '';
  isLoading = false;
  constructor(private _user:UserService){}

  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.isLoading = true;
    this._user.searchUsers(this.query, this.field, this.country, this.status).subscribe({
      next: (res: any) => {
        // Handle both array and object with users property
        if (res && res.users) {
          this.data = res.users;
        } else if (Array.isArray(res)) {
          this.data = res;
        } else {
          this.data = [];
        }
        
        this.isLoading = false;
        console.log('Loaded users:', this.data, 'Length:', this.data.length);
        
        // Log when no data is found
        if (!this.data || this.data.length === 0) {
          console.log('No users found with current filters');
        }
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
        this.data = [];
      }
    });
  }
  
  onSearch() {
    console.log('Searching with filters:', {
      query: this.query,
      field: this.field,
      country: this.country,
      status: this.status
    });
    this.loadUsers();
  }
  
  onReset() {
    this.query = '';
    this.field = '';
    this.country = '';
    this.status = '';
    this.loadUsers();
  }
}