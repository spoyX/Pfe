import { Component } from '@angular/core';
import { BlogService } from '../../../core/services/blog/blog.service';

@Component({
  selector: 'app-blog-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './blog-sidebar.component.html',
  styleUrl: './blog-sidebar.component.css'
})
export class BlogSidebarComponent {

  data:any
  constructor(private _blog:BlogService){}

  ngOnInit() {

    this._blog.getall().subscribe({
      next: (res: any) => {
     this.data = res
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      }
    
    })

}
}
