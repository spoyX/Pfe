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
  
  constructor(private notificationService: NotificationService, private _auth: AuthentificationService) {}

  ngOnInit(): void {
    this.userId = this._auth.getDataFromToken()._id;
    this.loadNotifications();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  loadNotifications() {
    this.notificationService.getUnreadNotifications(this.userId).subscribe({
      next: (result: any) => {
        if (Array.isArray(result)) {
          this.notifications = result;
          this.unreadCount = this.notifications.filter(notif => !notif.read).length;
        } else {
          this.notifications = Array.isArray(result.data) ? result.data : [];
          this.unreadCount = this.notifications.filter(notif => !notif.read).length;
        }
      },
      error: (err) => {
        console.error("Error fetching notifications:", err);
      }
    });
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const notificationIndex = this.notifications.findIndex(notif => notif._id === id);
        if (notificationIndex !== -1) {
          this.notifications[notificationIndex].read = true;
          this.unreadCount--;
        }
      },
      error: (err) => {
        console.error("Error marking notification as read:", err);
      }
    });
  }
}
