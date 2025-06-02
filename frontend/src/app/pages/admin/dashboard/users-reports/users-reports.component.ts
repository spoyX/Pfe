import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserService } from '../../../../core/services/users/user.service';
import {
  
  ChartModule,
  CategoryService,
  LegendService,
  TooltipService,
  DataLabelService,
  LineSeriesService,
  ColumnSeriesService,
  StackingColumnSeriesService,
  PieSeriesService,
  AccumulationChartModule,
  AccumulationLegendService,
  AccumulationTooltipService,
  AccumulationDataLabelService,
  DateTimeService,
  DateTimeCategoryService,
  AreaSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-reports',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule, 
    AccumulationChartModule,
  DragDropModule,
    ProgressBarModule,
    FormsModule
  ],
  providers: [
    PieSeriesService,
    CategoryService,
    LegendService,
    TooltipService,
    ColumnSeriesService,
    DataLabelService,
    DateTimeService,
    LineSeriesService,
    AreaSeriesService,
    PieSeriesService,
    DataLabelService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    LineSeriesService,
    DateTimeCategoryService,

 
  ],
  templateUrl: './users-reports.component.html',
  styleUrl: './users-reports.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class UsersReportsComponent implements OnInit {
 eventData: any[];
   metricsCards: any[] = [];

  // User data
  data: any[] = [];
  active: number = 0;
  inactive: number = 0;
  expired: number = 0;

  // Chart data
  public areaData: object[] = [];
  public genderData: object[] = [];
  public countryData: object[] = [];

  public barData: object[] = [];
  public primaryXAxis: object = { valueType: 'Category' };
  public primaryYAxis: object = { minimum: 0, maximum: 100, interval: 20 };
  public palette: string[] = [
    '#4dc9f6',
    'rgba(218, 211, 69, 0.91)',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba',
  ];
  public legendSettings: object = { visible: true, position: 'Bottom' };
  public tooltip: object = { enable: true };

  public barTitle: string = 'User Status Comparison';
  public genderTitle: string = 'Gender Split';
  public countryTitle: string = 'Country/Region Distribution';
  public registrationTitle: string = 'User Registrations Per Month';

  // New Users This Week Data
  public newUsersThisWeek: number = 0;
  public weeklyData: object[] = [];
  public lineTitle: string = 'New Users This Week';
  public lineXAxis: object = { valueType: 'DateTime', labelFormat: 'MMM dd' };
  public lineYAxis: object = { title: 'Count', minimum: 0 };

  public monthlyRegistrationData: object[] = [];

  public registrationPrimaryXAxis: object = {
    valueType: 'DateTime',
    labelFormat: 'MMM yyyy',
    intervalType: 'Months',
    interval: 1,
  };
  public registrationPrimaryYAxis: object = {
    title: 'Number of Registrations',
    minimum: 0,
  };
  canadaPercentage: any;
  tunisiaPercentage: any;
  tunisiaUsers: any;
  canadaUsers: any;
  totalUsers: any;
  // Progress bar properties
  height: string = '40px';
  width: string = '100%';
 
  trackColor: string = '#E0E0E0';
  progressColor: string = '#48bb78';
  progressCanadaColor: string = '#ecc94b';
  cssClass: string = 'custom-progress-bar';

public pieChartData: any[] = [];

public pieTooltip: Object = {
  enable: true,
  format: '${point.x} : ${point.y} users'
};

public pieLegend: Object = {
  visible: true,
  position: 'Bottom'
};

public pieDataLabel: Object = {
  visible: true,
  name: 'text',
  position: 'Outside',
  font: {
    fontWeight: '600'
  }
};


  constructor(private userService: UserService) {
    this.eventData = [];
  }

  ngOnInit() {
   

    // Fetch user data
    this.fetchUserData();
    const savedOrder = localStorage.getItem('cardOrder');


  }
  
 
  
  fetchUserData() {
    this.userService.alluser().subscribe({
      next: (res: any) => {
        // Process the response to get the data array
        if (Array.isArray(res)) {
          this.data = res;
        } else if (res && typeof res === 'object') {
          if (Array.isArray(res.data)) {
            this.data = res.data;
          } else if (Array.isArray(res.users)) {
            this.data = res.users;
          } else if (Array.isArray(res.results)) {
            this.data = res.results;
          } else {
            this.data = [];
          }
        } else {
          this.data = [];
        }

        // Calculate user counts by status
        if (Array.isArray(this.data)) {
          this.active = this.data.filter(
            (user: any) => user.status === 'active'
          ).length;
          this.inactive = this.data.filter(
            (user: any) => user.status === 'inactive'
          ).length;
          this.expired = this.data.filter(
            (user: any) => user.status === 'expired'
          ).length;

          // Prepare chart data
          this.calculateNewUsersThisWeek();
          this.prepareBarData();
          this.prepareCountryData();
          this.preparePieChartByCountry()
          this.prepareGenderData();
          this.prepareMonthlyRegistrationData();
        } else {
          console.error('Data is still not an array after processing');
          this.active = 0;
          this.inactive = 0;
          this.expired = 0;
        }
      },
      error: (err: any) => {
        console.log('Error fetching users:', err);
        this.active = 0;
        this.inactive = 0;
        this.expired = 0;
      },
    });
  }

  prepareGenderData() {
    const maleCount = this.data.filter(
      (user: any) => user.gender === 'male'
    ).length;
    const femaleCount = this.data.filter(
      (user: any) => user.gender === 'female'
    ).length;

    this.genderData = [
      { x: 'Male', y: maleCount },
      { x: 'Female', y: femaleCount },
    
    ];
    console.log('Gender Data:', this.genderData);
  }

  prepareBarData() {
    this.barData = [
      { x: 'Active', y: this.active },
      { x: 'Inactive', y: this.inactive },
      { x: 'Expired', y: this.expired },
    ];
  }
  
   prepareCountryData() {
    this.totalUsers = this.data.length;
    
    // Calculate user counts for Tunisia and Canada
    this.canadaUsers = this.data.filter(
      (user: any) => user.country === 'Canada'
    ).length;
    
    this.tunisiaUsers = this.data.filter(
      (user: any) => user.country === 'Tunisia'
    ).length;
    
    // Calculate percentages
    this.tunisiaPercentage = this.totalUsers > 0 
      ? parseFloat(((this.tunisiaUsers / this.totalUsers) * 100).toFixed(2))
      : 0;
      
    this.canadaPercentage = this.totalUsers > 0
      ? parseFloat(((this.canadaUsers / this.totalUsers) * 100).toFixed(2))
      : 0;
    
    // Prepare chart data
    this.countryData = [
      { x: 'Tunisia', y: this.tunisiaUsers },
      { x: 'Canada', y: this.canadaUsers }
    ];
  }
  preparePieChartByCountry() {
  const countryCounts: { [key: string]: number } = {};

  this.data.forEach((user: any) => {
    const country = user.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  this.pieChartData = Object.keys(countryCounts).map(country => ({
    country,
    count: countryCounts[country],
    text: `${country} (${countryCounts[country]})`
  }));

  console.log('Pie chart data:', this.pieChartData);
}
  
  
  calculateNewUsersThisWeek() {
    // Get users registered in the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Prepare daily data for the last 7 days
    this.weeklyData = [];

    // Assuming the data has a 'createdAt' or 'registrationDate' field
    // Count users registered in the last 7 days
    const recentUsers = this.data.filter((user: any) => {
      const registrationDate = new Date(user.createdAt || user.created_at);
      return registrationDate >= sevenDaysAgo && registrationDate <= today;
    });

    this.newUsersThisWeek = recentUsers.length;

    // Create daily breakdown for the area chart
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i)); // Start from 6 days ago

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Count users registered on this day
      const dailyUsers = recentUsers.filter((user: any) => {
        const registrationDate = new Date(user.createdAt || user.created_at);
        return registrationDate >= startOfDay && registrationDate <= endOfDay;
      }).length;

      this.weeklyData.push({
        x: date,
        y: dailyUsers,
      });
    }
    console.log('Weekly Data:', this.weeklyData);
  }

  prepareMonthlyRegistrationData() {
    const monthlyCounts: { [key: string]: number } = {};

    this.data.forEach((user: any) => {
      const registrationDate = new Date(user.createdAt || user.created_at);
      const yearMonth =
        registrationDate.getFullYear() +
        '-' +
        (registrationDate.getMonth() + 1); //YYYY-MM

      monthlyCounts[yearMonth] = (monthlyCounts[yearMonth] || 0) + 1;
    });

    this.monthlyRegistrationData = Object.keys(monthlyCounts).map(
      (yearMonth) => {
        const [year, month] = yearMonth.split('-').map(Number); // Split
        return {
          x: new Date(year, month - 1), // Date object (month is 0-based)
          y: monthlyCounts[yearMonth],
        };
      }
    );
  }
  drop(event: any) {
  const previousIndex = event.previousIndex;
  const currentIndex = event.currentIndex;

  if (previousIndex !== currentIndex) {
    const item = this.eventData[previousIndex];
    this.eventData.splice(previousIndex, 1);
    this.eventData.splice(currentIndex, 0, item);
  }
  
}

}