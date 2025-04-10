import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe} from '../../../../core/pipe/strip-html.pipe'
@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [StripHtmlPipe,CommonModule,RouterLink],
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


