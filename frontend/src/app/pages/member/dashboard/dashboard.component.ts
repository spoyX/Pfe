import { Component } from '@angular/core';
import {SidbarComponent} from '../../../shared/layout/member/sidbar/sidbar.component'
import {NavbarComponent} from '../../../shared/layout/member/navbar/navbar.component'
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../../shared/layout/admin/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidbarComponent, NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
