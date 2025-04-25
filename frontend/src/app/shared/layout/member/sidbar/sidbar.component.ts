import { Component } from '@angular/core';
import { RouterLinkActive , RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './sidbar.component.html',
  styleUrl: './sidbar.component.css'
})
export class SidbarComponent {
  unreadCount: number = 0;
  userId :any; 
  notifications: any[] = [];
  showDropdown = false;
  constructor(private notificationService: NotificationService,private _auth:AuthentificationService) {}

  ngOnInit(): void {
    
    this.userId=this._auth.getDataFromToken()._id
    this.loadUnreadNotifications()
    
   
  }
  

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  loadUnreadNotifications() {
    this.notificationService.getUnreadNotifications(this.userId)
      .subscribe({
        next: (result: any) => {
          // Handle the response based on its actual structure
          if (Array.isArray(result)) {
            this.notifications = result;
            this.unreadCount = result.length;
          } else {
            // If the result is an object with a data property or similar
            // Adjust according to your actual API response structure
            this.notifications = Array.isArray(result.data) ? result.data : [];
            this.unreadCount = this.notifications.length;
          }
        },
        error: (err) => {
          console.error("Error fetching notifications:", err);
        }
      });
  }
}
