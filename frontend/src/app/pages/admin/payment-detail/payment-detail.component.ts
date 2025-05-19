import { Component } from '@angular/core';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})
export class PaymentDetailComponent {
  data:any
  id:any
  constructor(private _payment :PaymentService ,private _act:ActivatedRoute){}

  ngOnInit(): void {
    this.id = this._act.snapshot.paramMap.get('id');
    this._payment.byId(this.id).subscribe({
      next:(res:any)=>{
        this.data=res
        
      },
      error:(err)=>{
        console.log(err)
      }
    })


    

  }
validate(id: string) {
  const body = {};

  this._payment.validate(this.id, body).subscribe({
    next: (res: any) => {
      Swal.fire({
        title: 'Validated!',
        text: 'The payment has been validated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.ngOnInit()
    },
    error: (err) => {
      console.log(err);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while validating the payment.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });

}
}