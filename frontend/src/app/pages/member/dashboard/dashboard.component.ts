import { Component } from '@angular/core';
import {SidbarComponent} from '../../../shared/layout/member/sidbar/sidbar.component'
import {NavbarComponent} from '../../../shared/layout/member/navbar/navbar.component'
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../../shared/layout/admin/sidebar/sidebar.component";

import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../../../core/auth/authentification.service';
declare var OneSignal: any;
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidbarComponent, NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  url = 'http://127.0.0.1:3000/api/onesignal/register';
  
    constructor(private auth:AuthentificationService,private http: HttpClient){
  
    }
    
    ngOnInit() {
      this.initializeOneSignal(); // this handles init + prompt
    }
    
   private initializeOneSignal() {
  OneSignal.init({
    appId: "4cc87a6c-3d64-4e0e-b04d-e433d8c10def",
    notifyButton: { enable: true },
    allowLocalhostAsSecureOrigin: true,
    serviceWorkerPath: './OneSignalSDKWorker.js',
    serviceWorkerUpdaterPath: './OneSignalSDKUpdaterWorker.js',
  })
  .then(() => OneSignal.Slidedown.promptPush())
  .then(() => {
    // subscription.id is your new playerId
    const playerId = OneSignal.User.PushSubscription.id;
    return this.http.post(this.url, {
      userId: this.auth.getDataFromToken()._id,
      playerId
    }).toPromise();
  })
  .then(() => console.log('Player ID registered'))
  .catch((err: any) => console.error('OneSignal error:', err));
}
}
  
  
    


