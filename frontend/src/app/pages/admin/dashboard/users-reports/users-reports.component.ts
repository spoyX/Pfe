import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  AreaSeriesService 
 

  
} from '@syncfusion/ej2-angular-charts';


@Component({
  selector: 'app-users-reports',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
  AccumulationChartModule,
  
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
    DataLabelService, AccumulationChartModule,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    LineSeriesService, 
    PieSeriesService ,
    
   
    DateTimeCategoryService,  
  ],
  templateUrl: './users-reports.component.html',
  styleUrl: './users-reports.component.css',
 
  
 
})
export class UsersReportsComponent {
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
    '#4267B2',  // Primary blue (similar to your header blue)
    '#34C759',  // Success green (slightly more vibrant than bootstrap)
    '#5856D6',  // Purple accent (adds visual interest)
    '#FF9500',  // Warm orange (friendlier than harsh yellow)
    '#FF3B30',  // Attention red (for critical items)
    '#5AC8FA',  // Light blue (complementary to primary)
    '#007AFF'   // Accent blue (for highlights)
  ];
  public legendSettings: object = { visible: true, position: 'Bottom' };
  public tooltip: object = { enable: true };

  public barTitle: string = 'User Status Comparison';
  public genderTitle: string = 'Gender Split';
  public countryTitle: string = 'Country/Region Distribution';
    public registrationTitle: string = 'User Registrations Per Month'

  // New Users This Week Data
  public newUsersThisWeek: number = 0;
  public weeklyData: object[] = [];
  public lineTitle: string = 'New Users This Week';
  public lineXAxis: object = { valueType: 'DateTime', labelFormat: 'MMM dd' };
  public lineYAxis: object = { title: 'Count', minimum: 0 };

  public monthlyRegistrationData: object[] = [];

  public registrationPrimaryXAxis: object = {
    valueType: 'DateTime',
    labelFormat: 'MMM yyyy',  // Format the labels
    intervalType: 'Months',   // Display intervals by month
    interval: 1
  };
  public registrationPrimaryYAxis: object = {
    title: 'Number of Registrations',
    minimum: 0
  };

 
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.fetchUserData();
  



  
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
          this.active = this.data.filter((user: any) => user.status === 'active').length;
          this.inactive = this.data.filter((user: any) => user.status === 'inactive').length;
          this.expired = this.data.filter((user: any) => user.status === 'expired').length;
          
          // Prepare chart data
          this.calculateNewUsersThisWeek()
          this.prepareBarData();
          this.prepareCountryData()
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
      }
    });
    
  }
  

  prepareGenderData() {
    const maleCount = this.data.filter((user: any) => user.gender === 'male').length;
    const femaleCount = this.data.filter((user: any) => user.gender === 'female').length;
    const otherCount = this.data.filter((user: any) => user.gender === 'other').length;

    this.genderData = [
      { x: 'Male', y: maleCount },
      { x: 'Female', y: femaleCount },
      { x: 'Other', y: otherCount }
    ];
    console.log("Gender Data:", this.genderData);
   
  }

  prepareBarData() {
    this.barData = [
      { x: 'Active', y: this.active },
      { x: 'Inactive', y: this.inactive },
      { x: 'Expired', y: this.expired }
    ];
   
  }
  prepareCountryData() {
    // Aggregate user counts by country/region
    const countryCounts: { [key: string]: number } = {
      'Tunisia': 0,  // Initialize counts
      'Canada': 0,
      'Other': 0
    };

    this.data.forEach((user: any) => {
      const country = user.country;

      if (country === 'Tunisia' || country === 'Canada') {
        countryCounts[country]++;
      } else {
        countryCounts['Other']++;
      }
    });

    this.countryData = Object.keys(countryCounts).map(country => ({
      x: country,
      y: countryCounts[country]
    }));
    console.log("Country Data:", this.countryData);
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
      const registrationDate = new Date(user.createdAt|| user.created_at);
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
        const registrationDate = new Date(user.createdAt  || user.created_at);
        return registrationDate >= startOfDay && registrationDate <= endOfDay;
      }).length;
      
      this.weeklyData.push({
        x: date,
        y: dailyUsers
      });
    }
    console.log("Weekly Data:", this.weeklyData); 
  }


  prepareMonthlyRegistrationData() {
    const monthlyCounts: { [key: string]: number } = {};

    this.data.forEach((user: any) => {
      const registrationDate = new Date(user.createdAt || user.created_at);
      const yearMonth = registrationDate.getFullYear() + '-' + (registrationDate.getMonth() + 1); //YYYY-MM

      monthlyCounts[yearMonth] = (monthlyCounts[yearMonth] || 0) + 1;
    });

    this.monthlyRegistrationData = Object.keys(monthlyCounts).map(yearMonth => {
      const [year, month] = yearMonth.split('-').map(Number); // Split
      return {
        x: new Date(year, month - 1),  // Date object (month is 0-based)
        y: monthlyCounts[yearMonth]
      };
    });
  }
}
