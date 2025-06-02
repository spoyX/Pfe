import { Component } from '@angular/core';
import { HomenavbarComponent } from "../homenavbar/homenavbar.component";
import { HomefooterComponent } from "../homefooter/homefooter.component";
import { EventService } from '../../../core/services/event/event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventhome',
  standalone: true,
  imports: [HomenavbarComponent,CommonModule, HomefooterComponent],
  templateUrl: './eventhome.component.html',
  styleUrl: './eventhome.component.css'
})
export class EventhomeComponent {

  events:any

  constructor(private _events:EventService){

  }
  ngOnInit(){
    this._events.getEventsWihoutFilter().subscribe({
      next:(res:any)=>{
        if (Array.isArray(res)) {
        this.events = res.slice(0, 3);
      } else {
        console.error('Expected an array but got:', res);
        this.events = [];
      }
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

}
