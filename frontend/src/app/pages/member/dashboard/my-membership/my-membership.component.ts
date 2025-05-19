import { Component } from '@angular/core';
import { MembershipService } from '../../../../core/services/memberships/membership.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import { RouterLink } from '@angular/router';

import jsPDF from 'jspdf';
// Import html2canvas for capturing elements to images
import html2canvas from 'html2canvas';
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
  downloadCertificate(): void {
    
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // background color
    doc.setFillColor(240, 245, 255);
    doc.rect(0, 0, 297, 210, 'F');

    //  decorative border
    doc.setDrawColor(70, 130, 180);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    //  inner border
    doc.setDrawColor(100, 150, 200);
    doc.setLineWidth(1);
    doc.rect(15, 15, 267, 180);

    // CCCT logo/header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(50, 50, 150);
    doc.text('CCCT MEMBERSHIP CERTIFICATE', 148.5, 40, { align: 'center' });

    //  decorative line
    doc.setDrawColor(70, 130, 180);
    doc.setLineWidth(1);
    doc.line(70, 45, 227, 45);

    // certificate text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text('This certifies that', 148.5, 70, { align: 'center' });

    //  member name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 100);
    doc.text(`${this.data.userId.firstName} ${this.data.userId.lastName}`, 148.5, 85, { align: 'center' });

    //  member details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text('is a verified member of the CCCT with membership number', 148.5, 100, { align: 'center' });

    //  membership number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 100);
    doc.text(`CCCT-2025-${this.data.membershipId}`, 148.5, 115, { align: 'center' });

    //  membership period
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    
    const startDate = new Date(this.data.startDate);
    const endDate = new Date(this.data.endDate);
    const startDateFormatted = startDate.toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    });
    const endDateFormatted = endDate.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
    
    doc.text(`Membership Period: ${startDateFormatted} - ${endDateFormatted}`, 148.5, 130, { align: 'center' });

    // Add job title
    if (this.data.userId.job) {
      doc.text(`Job: ${this.data.userId.job}`, 148.5, 145, { align: 'center' });
    }

    //  membership tier
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 135, 30); 
    doc.text( `PlanType: ${this.data.planType}`  , 148.5, 160, { align: 'center' });

    //  date of issue
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    const today = new Date();
    const issueDateFormatted = today.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
    doc.text(`Issued on: ${issueDateFormatted}`, 148.5, 175, { align: 'center' });

    // signature placeholder
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('CCCT President', 60, 185);
    doc.line(30, 180, 90, 180);
    doc.addImage('assets/admin.png', 'PNG', 40, 160, 40, 20);
    doc.text('Member', 148.5, 185);
    doc.line(120, 180, 177, 180);

    doc.text('CCCT Secretary', 240, 185);
    doc.line(210, 180, 270, 180);
    doc.addImage('assets/secretaire.png', 'PNG', 220, 160, 40, 20);
    // Save the PDF
    try {
      const fileName = `CCCT_Certificate_${this.data.membershipId}_${today.toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Failed to download certificate. Please try again.');
    } finally {

     
    }
  }


}
  




