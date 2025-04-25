import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import {AuthentificationService} from '../../../core/auth/authentification.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/users/user.service';
import 'emoji-picker-element';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,CommonModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: any[] = [];
  senderId: any; // Replace with dynamic user info as needed
  content: string = '';
  data:any
  showEmojiPicker: boolean = false; 
  errorMessage: string = '';


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
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  
  addEmoji(event: any) {
    const emoji = event.detail.unicode;
    this.content += emoji;
  }
  // Send a message using the ChatService
  sendMessage() {
    
    if (!this.content.trim()) {
      this.errorMessage = 'Message cannot be empty';
      return;
    }
    
    this.chatService.sendMessage(this.senderId, this.content).subscribe({
      next: () => {
        this.content = '';
        this.showEmojiPicker = false;
        this.errorMessage = ''; // Clear any previous errors
      },
      error: (err) => {
        console.error('Error sending message', err);
        
        // Check if it's our specific 400 error from backend
        if (err.status === 400 && err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Failed to send message. Please try again.';
        }
      }
    });
  }
  }
