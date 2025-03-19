import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder ,FormGroup ,FormControl ,Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/users/user.service';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  id:any
  editForm:FormGroup
  image:any
  data:any
  constructor(private fb:FormBuilder,private router: Router ,private _user:UserService,private _auth:AuthentificationService){
    let controls={
      email:new FormControl('',[Validators.email]),
      username:new FormControl('',[]),
      firstName:new FormControl('',[]),
      lastName:new FormControl('',[]),
      job:new FormControl('',[]),
      aboutMe:new FormControl('',[]),
      country:new FormControl('',[]),
      city:new FormControl('',[]),
      phone:new FormControl('',[]),
      facebookLink:new FormControl('',[]),
      instgramLink:new FormControl('',[]),
      linkedinLink:new FormControl('',[]),



    }
    this.editForm=this.fb.group(controls)

  }
  ngOnInit(){
    this.id=this._auth.getDataFromToken()._id
    this._user.byid(this.id).subscribe({
      next: (res: any)=>{
        this.data=res
        
        
      this.editForm.reset(res.user)
      
      }
    })

  }


  send(){
  ;
  

  }

}
