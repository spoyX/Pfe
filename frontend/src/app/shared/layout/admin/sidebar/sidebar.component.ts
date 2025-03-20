import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
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
