import { Component } from '@angular/core';
import { MembershipService } from '../../../../core/services/memberships/membership.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-membership',
  standalone: true,
  imports: [CommonModule,ProgressBarModule,RouterLink],
  templateUrl: './my-membership.component.html',
  styleUrl: './my-membership.component.css'
})
export class MyMembershipComponent {
  data: any;
  id: any;
  daysRemaining: number = 0;
  canRenew: boolean = false;
  progressValue: number = 0;

  constructor(private _membership: MembershipService, private _auth: AuthentificationService) {}

  ngOnInit(): void {
    this.id = this._auth.getDataFromToken()._id;
    this._membership.getById(this.id).subscribe({
      next: (res: any) => {
        this.data = res;
        
        this.calculateProgress(this.data.startDate, this.data.endDate);
        this.canRenew = this.daysRemaining <= 10 && this.daysRemaining >= 0;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  private calculateProgress(startDateStr: string, endDateStr: string): void {
    // Parse dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Set time to midnight to avoid time-of-day issues
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Get current date at midnight
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Get timestamps for easier math
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const nowTime = now.getTime();
    
    // Calculate total days in membership (add 1 to include end date)
    const totalDays = Math.round((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate days elapsed (add 1 to include today)
    const daysElapsed = Math.round((nowTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate days remaining
    this.daysRemaining = totalDays - daysElapsed;
    
    // Calculate progress (what percentage of days have been used)
    this.progressValue = Math.round((daysElapsed / totalDays) * 100);
    
    console.log({
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      now: now.toString(),
      totalDays,
      daysElapsed,
      daysRemaining: this.daysRemaining,
      progressValue: this.progressValue
    });
    
    // Ensure progress is within 0-100% range
    this.progressValue = Math.max(0, Math.min(100, this.progressValue));
  }
}




