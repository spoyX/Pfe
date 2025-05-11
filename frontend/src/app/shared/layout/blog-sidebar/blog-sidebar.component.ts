import { Component } from '@angular/core';
import { BlogService } from '../../../core/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../../../core/auth/authentification.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './blog-sidebar.component.html',
  styleUrl: './blog-sidebar.component.css'
})
export class BlogSidebarComponent {

  data:any
  top:any
  check:any
  isAdmin:boolean=false
  constructor(private _blog:BlogService,private _auth:AuthentificationService){}

  ngOnInit() {
    this.check=this._auth.getDataFromToken().role
    if(this.check === "admin"){
      this.isAdmin=true
    }
    else{ 
      this.isAdmin=false
    }

    this._blog.getall().subscribe({
      next: (res: any) => {
     this.data = res
     
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      }
    
    })
    this._blog.popular().subscribe({
      next: (res: any) => {
        this.top = res
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      }
    
    })



}
}
