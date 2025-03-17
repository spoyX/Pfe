import { Component } from '@angular/core';
import {SidbarComponent} from '../../../shared/layout/member/sidbar/sidbar.component'
import {NavbarComponent} from '../../../shared/layout/member/navbar/navbar.component'
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidbarComponent,NavbarComponent,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
