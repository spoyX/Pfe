import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventService } from '../../../../core/services/event/event.service';
import { ChartModule, LineSeriesService, AccumulationDataLabel,AccumulationLegend,DateTimeService, LegendService, TooltipService, DataLabelService, CategoryService, ColumnSeriesService, AccumulationChartModule, AccumulationSeries, PieSeriesService, AccumulationTooltipService, AccumulationDataLabelService, AccumulationLegendService } from '@syncfusion/ej2-angular-charts';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-event-dashboard',
  standalone: true,
  imports: [CommonModule,DragDropModule, ChartModule,AccumulationChartModule],
  providers: [LineSeriesService, DateTimeService, ColumnSeriesService,LegendService, TooltipService, DataLabelService,AccumulationSeries, PieSeriesService ,CategoryService, AccumulationLegendService,
      AccumulationTooltipService,
      AccumulationDataLabelService,],
  templateUrl: './event-dashboard.component.html',
  styleUrl: './event-dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventDashboardComponent {
  eventData: any[];
  upcomingEvents: number;
  totalRegistrations: number;
  totalRegistredToday: number;
  cancelledEvents: number;
  yearlyEventsData: any[] = [];
  participantData: any[] = [];


   // Data for drag and drop
   metricsCards: any[] = [];
   averageAttendanceCards: any[] = [];
   charts: any[] = [];
    // Chart Configuration
  public primaryXAxis: any;
  public primaryXAxiss: any;
  public primaryYAxiss: any;
  public pieChartSettings: any;
  public primaryYAxis: any;
  public chartData: any[] = [];
  public legendSettings: any;
  public tooltipSettings: any;
  public marker: any;
  public title: string;
  public palette: string[];
  averageAttendance: number = 0;
  public chartPalette:string[]
  constructor(private eventService: EventService) { 
    this.eventData = [];
    this.upcomingEvents = 0;
    this.totalRegistrations = 0;
    this.totalRegistredToday = 0;
    this.cancelledEvents = 0;
    this.chartData = [];
    
    // Chart configuration for registration trend
    this.title = 'Event Registration Trend';
    this.primaryXAxiss = {
      valueType: 'DateTime',
      labelFormat: 'MMM d',
      intervalType: 'Days',
      edgeLabelPlacement: 'Shift',
      majorGridLines: { width: 0 }
    };
    this.primaryYAxiss = {
      title: 'Registrations',
      minimum: 0,
      maximum: 100,
      interval: 20,
      labelFormat: '{value}',
      lineStyle: { width: 0 },
      majorTickLines: { width: 0 }
    };
    this.legendSettings = { visible: true, position: 'Bottom' };
    this.tooltipSettings = { enable: true, format: '${series.name} : ${point.x} : ${point.y}' };
    this.marker = { visible: true, width: 7, height: 7, shape: 'Circle' };
    this.palette = [
  '#5b7acb',  // Medium blue - matches your Membra brand color
  '#63c7b2',  // Soft teal
  '#8f7cb6',  // Muted purple
  '#f3866f'   // Soft coral
];

// Extended color palette for charts
this.chartPalette = [
  '#5b7acb',  // Medium blue - matches your Membra brand color
  '#63c7b2',  // Soft teal
  '#8f7cb6',  // Muted purple
  '#f3866f',  // Soft coral
  '#f9c27a',  // Soft amber
  '#76b0e0',  // Light blue
  '#a2c99b',  // Soft green
  '#d7aaea'   // Soft lavender
];
    // Chart configuration for yearly events
    this.title = 'Total Events This Year';
    this.primaryXAxis = {
      valueType: 'DateTime',
      title: 'Month',
      labelFormat: 'MMM',
      intervalType: 'Months',
      edgeLabelPlacement: 'Shift',
      majorGridLines: { width: 0 }
    };
    this.primaryYAxis = {
      title: 'Number of Events',
      minimum: 0,
      interval: 1,
      lineStyle: { width: 0 },
      majorTickLines: { width: 0 }
    };
     // Chart configuration for participant distribution
     this.pieChartSettings = {
      legendSettings: { visible: true, position: 'Right' },
      tooltipSettings: { enable: true },
   
    };
  }

  

  ngOnInit() {
    this.eventService.getEventsWihoutFilter().subscribe({
      next: (res: any) => {
        this.eventData = res;
        
        // Calculate dashboard metrics
        this.upcomingEvents = this.eventData.filter((event: any) => event.status === 'upcoming').length;
        this.totalRegistrations = this.eventData.reduce((acc: number, event: any) => {
          return acc + (event.registrations ? event.registrations.length : 0);
        }, 0);
        
        // Calculate the total number of registrations that occurred today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the start of today
        
        this.totalRegistredToday = this.eventData.reduce((acc: number, event: any) => {
          return acc + (event.registrations
            ? event.registrations.filter((registration: any) => {
                const regDate = new Date(registration.registrationDate);
                regDate.setHours(0, 0, 0, 0); // Set to the start of the registration date
                return regDate.getTime() === today.getTime();
              }).length
            : 0);
        }, 0);
        
        this.cancelledEvents = this.eventData.filter((event: any) => event.status === 'cancelled').length;
        
        // Process data for the registration trend chart
        this.prepareChartData();
        this.prepareYearlyEventsData()
        this.prepareParticipantData();
        this.calculateAverageAttendance();
        
      },
   
      error: (err: any) => {
        console.error('Error fetching event data:', err);
      }
    });
  }

  private prepareChartData(): void {
    // Find the upcoming event with the most registrations for the chart
    const upcomingEvents = this.eventData.filter((event: any) => event.status === 'upcoming');
    
    if (upcomingEvents.length === 0) {
      this.chartData = [];
      return;
    }

    // Sort by number of registrations (descending)
    upcomingEvents.sort((a: any, b: any) => {
      const aRegs = a.registrations ? a.registrations.length : 0;
      const bRegs = b.registrations ? b.registrations.length : 0;
      return bRegs - aRegs;
    });

    // Get the event with the most registrations
    const featuredEvent = upcomingEvents[0];
    
    // Check if the event has registrations
    if (!featuredEvent.registrations || featuredEvent.registrations.length === 0) {
      this.chartData = [];
      return;
    }

    // Group registrations by date
    const registrationMap = new Map();
    
    featuredEvent.registrations.forEach((registration: any) => {
      const regDate = new Date(registration.registrationDate);
      regDate.setHours(0, 0, 0, 0); // Normalize to start of day
      
      const dateKey = regDate.toISOString().split('T')[0];
      if (registrationMap.has(dateKey)) {
        registrationMap.set(dateKey, registrationMap.get(dateKey) + 1);
      } else {
        registrationMap.set(dateKey, 1);
      }
    });

    // Convert to chart data format with cumulative values
    let cumulativeCount = 0;
    this.chartData = Array.from(registrationMap.entries()).map(([dateStr, count]) => {
      cumulativeCount += count as number;
      return {
        x: new Date(dateStr),
        y: cumulativeCount,
        dailyCount: count
      };
    }).sort((a, b) => a.x.getTime() - b.x.getTime());

    // If we have enough data points, adjust y-axis maximum
    if (this.chartData.length > 0) {
      const maxRegistrations = this.chartData[this.chartData.length - 1].y;
      this.primaryYAxis.maximum = Math.ceil(maxRegistrations / 20) * 20 + 20;
    }
  }
  prepareYearlyEventsData() {
    // Group events by month
    const currentYear = new Date().getFullYear();
    const monthlyEventCounts: { [key: number]: number } = {};

    this.eventData.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate.getFullYear() === currentYear) {
        const month = eventDate.getMonth();
        if (!monthlyEventCounts[month]) {
          monthlyEventCounts[month] = 0;
        }
        monthlyEventCounts[month]++;
      }
    });

    // Convert to chart data format
    this.yearlyEventsData = Array.from({ length: 12 }, (_, index) => ({
      x: new Date(currentYear, index, 1),
      y: monthlyEventCounts[index] || 0
    }));
  }
prepareParticipantData() {
  // Aggregate participant counts per event, excluding cancelled events
  this.participantData = this.eventData
    .filter(event => event.status !== 'cancelled') // Filter out cancelled events
    .map(event => ({
      x: event.title,
      y: event.registrations ? event.registrations.length : 0
    }));
}

calculateAverageAttendance() {
  if (this.eventData.length === 0) {
    this.averageAttendance = 0;
    return;
  }

 

  this.averageAttendance = Math.round(this.totalRegistrations / this.eventData.length);
  console.log("Average Attendance:", this.averageAttendance); // Debugging line
  
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
