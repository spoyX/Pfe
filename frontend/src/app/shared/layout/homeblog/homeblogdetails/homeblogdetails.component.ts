import { Component } from '@angular/core';
import { HomenavbarComponent } from "../../homenavbar/homenavbar.component";
import { HomefooterComponent } from "../../homefooter/homefooter.component";
import { BlogService } from '../../../../core/services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { StripHtmlPipe } from '../../../../core/pipe/strip-html.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homeblogdetails',
  standalone: true,
  imports: [HomenavbarComponent, CommonModule,StripHtmlPipe,HomefooterComponent],
  templateUrl: './homeblogdetails.component.html',
  styleUrl: './homeblogdetails.component.css'
})
export class HomeblogdetailsComponent {
  
  blog:any
  id:any
 

  constructor(private _blog:BlogService,private _act:ActivatedRoute){

  }
  ngOnInit(){
    this.id=this._act.snapshot.paramMap.get('id');
    this._blog.getById(this.id).subscribe({
      next:(res:any)=>{
        this.blog=res
   
      },
      error:(err:any)=>{
        console.log(err);
        
      }

    })
  }

}
