import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import {AuthentificationService} from '../../../core/auth/authentification.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/users/user.service';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: any[] = [];
  senderId: any; // Replace with dynamic user info as needed
  content: string = '';
  data:any


  constructor(private chatService: ChatService,private _auth:AuthentificationService,private _user:UserService) {}

  ngOnInit() {
    this.senderId=this._auth.getDataFromToken()._id
    this._user.byid(this.senderId).subscribe({
      next: (res: any)=>{
        this.data=res
    
      
      }
    })
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  // Send a message using the ChatService
  sendMessage() {
    if (this.content.trim()) {
      this.chatService.sendMessage(this.senderId, this.content).subscribe({
        next: () => this.content = '',
        error: (err) => console.error('Error sending message', err)
      });
    }
  }
}