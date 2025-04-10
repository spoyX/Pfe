import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private API_URL = 'http://127.0.0.1:3000/api/chat/';
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load initial messages from the backend
    this.getRecentMessages().subscribe(messages => {
      this.messagesSubject.next(messages);
    });
    // Initialize Pusher for real-time updates
    this.initializePusher();
  }

  // Retrieve recent messages from the backend
  getRecentMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/recent`);
  }

  // Send a new message to the backend
  sendMessage(senderId: string, content: string): Observable<any> {
    return this.http.post(`${this.API_URL}/send`, { senderId, content });
  }

  // Initialize Pusher to listen for new messages
  private initializePusher() {
    const pusher = new Pusher('44f4c35a0a3497d3445a', {
      cluster: 'eu'
    });
  
    const channel = pusher.subscribe('public-chat');
    channel.bind('new-message', (data: any) => {
      const currentMessages = this.messagesSubject.getValue();
      // Ensure the message has the proper structure
      const formattedMessage = {
        _id: data._id,
        sender: data.sender, // This now contains the _id, username, and profileImage
        content: data.content,
        createdAt: data.createdAt
      };
      this.messagesSubject.next([...currentMessages, formattedMessage]);
    });
  }

}