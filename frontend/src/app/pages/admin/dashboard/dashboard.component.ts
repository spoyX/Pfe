import { Component } from '@angular/core';
import {SidebarComponent} from '../../../shared/layout/admin/sidebar/sidebar.component'
import {NavbarComponent} from '../../../shared/layout/admin/navbar/navbar.component'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent,NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
