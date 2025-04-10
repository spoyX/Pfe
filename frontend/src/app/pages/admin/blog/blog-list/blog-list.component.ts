import { Component } from '@angular/core';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe} from '../../../../core/pipe/strip-html.pipe'
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule,StripHtmlPipe,RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent {
  data:any
  constructor(private _blog:BlogService){}


  ngOnInit(){
    this._blog.getall().subscribe({
      next:(res:any)=>{
       this.data=res
      },
      error:(err)=>{

      }
    })
  }

}
