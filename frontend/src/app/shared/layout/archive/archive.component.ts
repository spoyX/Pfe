import { Component } from '@angular/core';
import { BlogService } from '../../../core/services/blog/blog.service';
import { AuthentificationService } from '../../../core/auth/authentification.service';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css'
})
export class ArchiveComponent {
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
      
   
  
  
  
  }
  }
  


