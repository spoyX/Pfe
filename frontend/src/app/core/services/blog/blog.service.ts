import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private url = 'http://127.0.0.1:3000/api/blog/';
  constructor(private http: HttpClient) { }


  create(data:any){
    return this.http.post(this.url +'create',data)
  }

  getall(){
    return this.http.get(this.url+'getall')
  }
  getById(id:any){
    return this.http.get(this.url +'byid/'+id)
  }
  getComments(blogId: any) {
    return this.http.get(this.url + blogId + '/comments');
  }

  
  createComment(blog: any, content: string, userId: string) {
    return this.http.post(
      this.url +  blog + '/comments',
      { content, userId }
    );
  }
  deleteComment(id:any){
    return this.http.delete(this.url +'comment/'+id)
  }

  updateBlog(id:any,data:any){
    return this.http.put(this.url +'update/' + id ,data)
  }

  delete(id:any){
    return this.http.delete(this.url +'delete/' + id)
  }
  popular(){
    return this.http.get(this.url +'popular')
  }

}
