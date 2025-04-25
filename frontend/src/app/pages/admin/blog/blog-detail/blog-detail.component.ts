import { Component } from '@angular/core';
import {BlogService} from '../../../../core/services/blog/blog.service'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StripHtmlPipe} from '../../../../core/pipe/strip-html.pipe'
import { TimeAgoPipe } from '../../../../core/pipe/time-ago.pipe';
import { ReactiveFormsModule , FormBuilder,FormControl,Validators,FormGroup} from '@angular/forms';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


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

  onDeleteComment(commentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This comment will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._blog.deleteComment(commentId).subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The comment has been deleted.',
              timer: 1500,
              showConfirmButton: false
            });
            this.ngOnInit(); // Refresh comments list
          },
          error: (err: any) => {
            console.error('Error deleting comment:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'An error occurred while deleting the comment.',
            });
          }
        });
      }
    });
  }

  ondelete(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the blog entry.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._blog.delete(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'The blog entry has been deleted.'
            });
            this._router.navigate(['/admin/blog']);
          },
          error: (err: any) => {
            console.error('Error deleting blog entry', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete the blog entry. Please try again.'
            });
          }
        });
      }
    });
  }
}



