import { Component } from '@angular/core';
import { RouterLinkActive , RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLinkActive,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {



  constructor(){

  }
  logout(){
    localStorage.removeItem('token')
    window.location.reload()
  }

}
