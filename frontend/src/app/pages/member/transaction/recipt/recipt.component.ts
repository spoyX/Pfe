import { Component } from '@angular/core';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipt.component.html',
  styleUrl: './recipt.component.css'
})
export class ReciptComponent {
  id:any
  data:any
  qrCodeImgSrc: any;

  constructor(private _auth :AuthentificationService ,private _payment:PaymentService,private _act:ActivatedRoute){
    this.id=this._act.snapshot.paramMap.get('id')
    console.log(this.id);
    
  }

  ngOnInit(){
    this.id=this._act.snapshot.paramMap.get('id')
    
    this._payment.byId(this.id).subscribe({
      next: (res: any)=>{
        this.data=res
        this.generateQrCode()
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }
  generateQrCode() {
    const receiptUrl = `http://localhost:4200/member/transaction/recipt/${this.data._id}`;
    const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(receiptUrl)}`;
    this.qrCodeImgSrc = qrCodeImgSrc;
  }
 
}




