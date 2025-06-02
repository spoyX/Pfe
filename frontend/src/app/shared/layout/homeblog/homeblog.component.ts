import { Component } from '@angular/core';
import { HomenavbarComponent } from "../homenavbar/homenavbar.component";
import { HomefooterComponent } from "../homefooter/homefooter.component";
import { BlogService } from '../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe } from '../../../core/pipe/strip-html.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homeblog',
  standalone: true,
  imports: [HomenavbarComponent, HomefooterComponent,CommonModule,StripHtmlPipe,RouterLink],
  templateUrl: './homeblog.component.html',
  styleUrl: './homeblog.component.css'
})
export class HomeblogComponent {
  blogs:any

  constructor(private _blog:BlogService){

  }

  ngOnInit(){
    this._blog.popular().subscribe({
      next:(res:any)=>{
        this.blogs=res

      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

}
