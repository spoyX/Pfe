import { Component, ViewChild } from '@angular/core';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe} from '../../../../core/pipe/strip-html.pipe'
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { BlogSidebarComponent } from '../../../../shared/layout/blog-sidebar/blog-sidebar.component';
@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule,StripHtmlPipe,RouterLink,MatButtonModule,MatPaginatorModule,BlogSidebarComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent {
  data:any
  pageSize = 6; // Show 6 blogs per page (3 rows of 2)
  pageSizeOptions = [6, 12, 24, 48];
  pageIndex = 0;
  totalBlogs = 0;
  allBlogs: any[] = [];
  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  constructor(private _blog:BlogService){}


  ngOnInit() {
    this.loadBlogs();
  }
  
  ngAfterViewInit() {
    // If paginator exists, subscribe to page changes
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.updateDisplayedBlogs();
      });
    }
  }
  
  loadBlogs() {
    this.isLoading = true;
    this._blog.getall().subscribe({
      next: (res: any) => {
        // Handle response based on format
        if (Array.isArray(res)) {
          this.allBlogs = res;
        } else if (res && res.blogs) {
          this.allBlogs = res.blogs;
        } else {
          this.allBlogs = [];
        }
        
        this.totalBlogs = this.allBlogs.length;
        this.updateDisplayedBlogs();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.isLoading = false;
        this.allBlogs = [];
        this.data = [];
        this.totalBlogs = 0;
      }
    });
  }
  
  updateDisplayedBlogs() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.data = this.allBlogs.slice(startIndex, endIndex);
  }
  
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedBlogs();
  }
}