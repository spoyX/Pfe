import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { UserService } from '../../../../core/services/users/user.service';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Import Syncfusion Chart modules
import { 
  ChartModule, 
  LineSeriesService, 
  CategoryService, 
  LegendService, 
  TooltipService,
  ColumnSeriesService,
  DateTimeService,
  PieSeriesService,
  AccumulationChartModule, 
  AccumulationLegendService, 
  AccumulationTooltipService,
  AccumulationDataLabelService
} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterLink, 
    CommonModule,
    ChartModule,
    AccumulationChartModule
  ],
  providers: [
    CategoryService, 
    LineSeriesService, 
    LegendService, 
    TooltipService, 
    ColumnSeriesService,
    DateTimeService,
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class MainComponent implements OnInit {
  id: any;
  data: any;
  payments: any[] = [];
  totalAmount: number = 0;
  paymentCount: number = 0;
  newPayment: number = 0;
  RnewPayment: number = 0; // For renewed payments
  averagePrice: number = 0;
  
  // Chart data
  public monthlyPaymentData: any[] = [];
  public pieData: any[] = [];
  
  // Chart configuration
  public primaryXAxis: any; 
  public primaryYAxis: any;
  public tooltip: any = { enable: true };
  public legend: any = { visible: true };
  public palette: string[] = ['#5b9bd5', '#a5a5a5', '#a5a5a5', '#ffc000', '#4472c4'];
  
  constructor(
    private _auth: AuthentificationService, 
    private _user: UserService,
    private _payment: PaymentService
  ) {}

  ngOnInit() {
    this.id = this._auth.getDataFromToken()._id;
    this._user.byid(this.id).subscribe({
      next: (res: any) => {
        this.data = res;
      }
    });
    
    this._payment.getPayment().subscribe({
      next: (res: any) => {
        this.payments = res;
        this.calculatePaymentStats();
        this.prepareChartData();
      },
      error: (err) => {
        console.log(err);
      }
    });

    // Configure chart axes
    this.primaryXAxis = {
      valueType: 'Category',
      title: 'Month',
      labelIntersectAction: 'Rotate45',
      majorGridLines: { width: 0 }
    };
    
    this.primaryYAxis = {
      title: 'Amount ($)',
      labelFormat: '${value}',
      majorTickLines: { width: 0 },
      lineStyle: { width: 0 }
    };
  }

  calculatePaymentStats() {
    if (this.payments && this.payments.length > 0) {
      this.paymentCount = this.payments.length;
      
      // Count payments where ID starts with "NEW"
      this.newPayment = this.payments.filter((payment: any) => 
        payment.paymentId && payment.paymentId.startsWith('#SK')
      ).length;
      
      // Count payments where ID starts with "REN" (for renewals)
      this.RnewPayment = this.payments.filter((payment: any) => 
        payment.paymentId && payment.paymentId.startsWith('#NEW')
      ).length;
      
      this.totalAmount = this.payments.reduce((sum: number, payment: any) => 
        sum + (payment.amount ? parseFloat(payment.amount) : 0), 0);
      
      // Calculate average price
      this.averagePrice = this.totalAmount / this.paymentCount;
      // Round to 2 decimal places
      this.averagePrice = Math.round(this.averagePrice * 100) / 100;
    } else {
      this.paymentCount = 0;
      this.newPayment = 0;
      this.RnewPayment = 0;
      this.totalAmount = 0;
      this.averagePrice = 0;
    }
  }

  prepareChartData() {
    if (!this.payments || this.payments.length === 0) return;

    // Group payments by month for column chart
    const monthlyData: { [key: string]: number } = {};
    const paymentTypeData: { [key: string]: number } = {};
    
    this.payments.forEach((payment: any) => {
      // Extract month from payment date
      const paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : new Date();
      const monthYear = paymentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      // Accumulate amounts by month
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += payment.amount ? parseFloat(payment.amount) : 0;
      
      // Categorize by payment type (based on ID prefix)
      let paymentType = 'Other';
      if (payment.paymentId) {
        if (payment.paymentId.startsWith('#NEW')) {
          paymentType = 'New';
        } else if (payment.paymentId.startsWith('#SK')) {
          paymentType = 'Renewal';
        }
      }
      
      if (!paymentTypeData[paymentType]) {
        paymentTypeData[paymentType] = 0;
      }
      paymentTypeData[paymentType] += payment.amount ? parseFloat(payment.amount) : 0;
    });
    
    // Convert to chart data format for column chart
    this.monthlyPaymentData = Object.keys(monthlyData).map(month => ({
      month: month,
      amount: monthlyData[month]
    }));
    
    // Sort by date
    this.monthlyPaymentData.sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Convert payment type data to pie chart format
    // Calculate total for percentages
    const totalAmount = Object.values(paymentTypeData).reduce((sum, amount) => sum + amount, 0);
    
    this.pieData = Object.keys(paymentTypeData).map(type => {
      const amount = paymentTypeData[type];
      const percentage = totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0;
      
      return {
        category: type,
        amount: amount,
        text: `${type}: ${percentage}%`
      };
    });
  }
}