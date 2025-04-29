import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/users/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,MatPaginatorModule,
    MatButtonModule ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  data:any
  query = '';
  allData: any[] = [];
  field: 'username' | 'firstName' | 'lastName' | 'country' | 'status' | '' = '';
  country = '';
  status: 'active' | 'inactive' | 'expired' | '' = '';
  isLoading = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  pageIndex = 0;
  totalUsers = 0;

  constructor(private _user:UserService){}

  ngOnInit() {
    this.loadUsers();
  }
  ngAfterViewInit() {
    // If paginator exists, subscribe to page changes
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.updateDisplayedData();
      });
    }
  }
  
  loadUsers() {
    this.isLoading = true;
    this._user.searchUsers(this.query, this.field, this.country, this.status).subscribe({
      next: (res: any) => {
        // Handle both array and object with users property
        if (res && res.users) {
          this.allData = res.users;
        } else if (Array.isArray(res)) {
          this.allData = res;
        } else {
          this.allData = [];
        }
        
        this.totalUsers = this.allData.length;
        this.pageIndex = 0; // Reset to first page on new search
        
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        
        this.updateDisplayedData();
        this.isLoading = false;
        
        console.log('Loaded users:', this.allData, 'Total:', this.totalUsers);
        
        // Log when no data is found
        if (!this.allData || this.allData.length === 0) {
          console.log('No users found with current filters');
        }
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
        this.allData = [];
        this.data = [];
        this.totalUsers = 0;
      }
    });
  }

  updateDisplayedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.data = this.allData.slice(startIndex, endIndex);
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
  
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedData();
  }
}