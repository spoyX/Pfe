import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
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
  DateTimeCategoryService
} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-blog-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ChartModule, AccumulationChartModule],
  templateUrl: './blog-dashboard.component.html',
  styleUrl: './blog-dashboard.component.css',
  providers: [
    CategoryService, 
    LegendService, 
    TooltipService, 
    DataLabelService, 
    LineSeriesService,
    ColumnSeriesService,
    StackingColumnSeriesService,
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    DateTimeService,
    DateTimeCategoryService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BlogDashboardComponent {
  blogs: any;
  top: any;
  totalComments: number = 0;
  averageCommentsPerBlog: number = 0;
  chartData: any[] = [];
  monthlyBlogData: any[] = [];
  public palette: string[];
  // Chart title
  public title: string = 'Blog Statistics';
  public primaryXAxis: any;
  public primaryYAxis: any;
  public tooltip: any;
  public legend: any;
  public marker: any;
  
  // Monthly chart properties
  public monthlyChartTitle: string = 'Blogs Created Per Month';
  public monthlyXAxis: any;
  public monthlyYAxis: any;
  
  
  constructor(private _blog: BlogService) { 
    this.palette = ['#6610f2', '#7E57C2', '#2196F3', '#4CAF50'];

  }
  
  ngOnInit() {
    this._blog.getall().subscribe({
      next: (res: any) => {
        this.blogs = res;
        this.calculateTotalComments();
        this.calculateAverageComments();
        this.prepareChartData();
        this.prepareMonthlyBlogData();
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      }
    });
    
    this._blog.popular().subscribe({
      next: (res: any) => {
        this.top = res;
      },
      error: (err) => {
        console.error('Error fetching popular blogs:', err);
      }
    });
    
    // Comments Chart configuration
    this.primaryXAxis = {
      valueType: 'Category',
      title: 'Blogs',
      labelRotation: -45,
    };
    
    this.primaryYAxis = {
      minimum: 0,
      title: 'Comments Count',
      interval: 1
    };
    
    // Monthly blogs chart configuration
    this.monthlyXAxis = {
      valueType: 'DateTime',
      labelFormat: 'MMM yyyy',
      intervalType: 'Months',
      edgeLabelPlacement: 'Shift',
      title: 'Month'
    };
    
    this.monthlyYAxis = {
      minimum: 0,
      title: 'Blog Count',
      interval: 1,
      labelFormat: '{value}',
    };
    
    this.tooltip = { enable: true };
    this.legend = { visible: true };
    this.marker = { visible: true, height: 10, width: 10 };
  }
  
  calculateTotalComments() {
    this.totalComments = this.blogs.reduce((sum: number, blog: any) => {
      return sum + (blog.comments ? blog.comments.length : 0);
    }, 0);
  }
  
  calculateAverageComments() {
    if (this.blogs && this.blogs.length > 0) {
      this.averageCommentsPerBlog = this.totalComments / this.blogs.length;
    } else {
      this.averageCommentsPerBlog = 0;
    }
  }
  
  prepareChartData() {
    // For simplicity, only showing the top 5 blogs by comments
    this.chartData = this.blogs
      .slice(0, 5)
      .map((blog: any) => {
        return {
          blogTitle: blog.title.length > 10 ? blog.title.substring(0, 10) + '...' : blog.title,
          comments:  blog.comments.length 
        };
      });
  }
  
  prepareMonthlyBlogData() {
    if (!this.blogs || this.blogs.length === 0) return;
    
    // Group blogs by month and year
    const blogsByMonth = this.blogs.reduce((acc: any, blog: any) => {
      const date = new Date(blog.createdAt);
      const monthYear = new Date(date.getFullYear(), date.getMonth(), 1);
      
      // Create a string key for the month-year
      const key = monthYear.toISOString();
      
      if (!acc[key]) {
        acc[key] = {
          date: monthYear,
          count: 0
        };
      }
      
      acc[key].count++;
      return acc;
    }, {});
    
    // Convert to array and sort by date
    this.monthlyBlogData = Object.values(blogsByMonth)
      .sort((a: any, b: any) => a.date - b.date);
    
    // If there's not enough data, add some sample months
    if (this.monthlyBlogData.length < 6) {
      const lastDate = this.monthlyBlogData.length > 0 
        ? new Date(this.monthlyBlogData[this.monthlyBlogData.length - 1].date) 
        : new Date();
        
      // Add some empty months if there's not enough data
      for (let i = 1; i <= 6 - this.monthlyBlogData.length; i++) {
        const newDate = new Date(lastDate);
        newDate.setMonth(newDate.getMonth() + i);
        
        this.monthlyBlogData.push({
          date: newDate,
          count: 0
        });
      }
    }
  }
  
  deleteBlog(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this blog? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._blog.delete(id).subscribe({
          next: (res: any) => {
            console.log('Blog deleted successfully:', res);
            Swal.fire('Deleted!', 'The blog has been deleted.', 'success');
            this.ngOnInit(); // Refresh the blog list after deletion
            this.calculateTotalComments(); // Recalculate total comments after deletion
            this.calculateAverageComments(); // Recalculate average comments after deletion
            this.prepareMonthlyBlogData(); // Recalculate monthly blog data after deletion
          },
          error: (err) => {
            console.error('Error deleting blog:', err);
            Swal.fire('Error!', 'An error occurred while deleting the blog.', 'error');
          }
        });
      }
    });
  }
  

}