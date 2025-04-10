import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe} from '../../../core/pipe/strip-html.pipe'
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule,RouterLink,StripHtmlPipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  data:any
  gridView = true;
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


