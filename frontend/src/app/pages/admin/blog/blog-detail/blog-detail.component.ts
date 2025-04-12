import { Component } from '@angular/core';
import {BlogService} from '../../../../core/services/blog/blog.service'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe} from '../../../../core/pipe/strip-html.pipe'
import { TimeAgoPipe } from '../../../../core/pipe/time-ago.pipe';
import { ReactiveFormsModule , FormBuilder,FormControl,Validators,FormGroup} from '@angular/forms';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule,StripHtmlPipe,ReactiveFormsModule,TimeAgoPipe,RouterLink],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent {
  data:any
  id:any
  userId:any
  comment:any
  comments:FormGroup
  constructor(private _blog:BlogService,private _act:ActivatedRoute,private fb:FormBuilder,private _auth:AuthentificationService,private _router:Router) {
    let controls={
      content:new FormControl('',[])
    }
    this.comments=this.fb.group(controls)
  }

  ngOnInit(){
    this.userId=this._auth.getDataFromToken()._id
    this.id = this._act.snapshot.paramMap.get('id');
    this._blog.getById(this.id).subscribe({
      next:(res:any)=>{
         this.data=res
      
         
      },
      error:(err:any)=>{
      }
    })
    this._blog.getComments(this.id).subscribe({
      next:(res:any)=>{
          this.comment=res
        
      },
      error:(err)=>{
        console.log(err)
      }
    })

    

  }

  send(){
  
    if (this.comments.valid) {
      this._blog.createComment(this.id, this.comments.value.content, this.userId).subscribe({
        next: (res: any) => {
          this.ngOnInit()
          this.comments.reset();
          
          
        },
        error: (err: any) => {
          console.error('Error creating comment:', err);
        }
      });
    }
  }

  onDeleteComment(commentId: string){
    this._blog.deleteComment(commentId).subscribe({
      next: (res: any) => {
        console.log('Comment deleted successfully');
        this.ngOnInit(); // Refresh the page to update the comments list
      },
      error: (err: any) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  ondelete(id:any){
  this._blog.delete(id).subscribe({
    next:(res:any)=>{
      this._router.navigate(['/admin/blog']);
    },
    error:(err:any)=>{
      console.log(err);
      
    }
  })
  }
}



