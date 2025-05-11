import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe} from '../../../core/pipe/strip-html.pipe'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { BlogSidebarComponent } from "../../../shared/layout/blog-sidebar/blog-sidebar.component";
import { ArchiveComponent } from "../../../shared/layout/archive/archive.component";
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, StripHtmlPipe, MatButtonModule, MatPaginatorModule, BlogSidebarComponent, ArchiveComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
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