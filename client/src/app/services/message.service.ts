import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group.model';
import { Message } from '../models/message.model';
import { UserParams } from '../models/user-params.model';
import { User } from '../models/user.model';
import { getPaginatedResult, getPaginationHeraders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl
  private hubUrl = environment.hubUrl;
  private hubConnection!: HubConnection
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  public messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: User | null, otherUsername: string) {
    if (user) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl + "message?user=" + otherUsername, {
          accessTokenFactory: () => user.token
        }).withAutomaticReconnect().build();

      this.hubConnection.start().catch(error => console.log(error));

      this.hubConnection.on("ReceiveMessageThread", messages => {
        console.log("RReceiveMessageThread====>", messages);
        this.messageThreadSource.next(messages);
      });

      this.hubConnection.on("NewMessage", message => {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          this.messageThreadSource.next([...messages, message]);
        });
      });

      this.hubConnection.on("UpdatedGroup", (group: Group) => {
        if (group.connections.some(x => x.username === otherUsername)) {
          this.messageThread$.pipe(take(1)).subscribe(messages => {
            messages.forEach(message => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource.next([...messages]);
          });
        }
      });
    }
  }

  stopHubConnection() {
    this.hubConnection?.stop();
  }

  getMessages(userParams: UserParams) {
    let params = getPaginationHeraders(userParams)
    params = params.append("Container", userParams.container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  // sendMessage(username: string, content: string) {
  //   return this.http.post<Message>(this.baseUrl + 'messages', { recipientUsername: username, content: content });
  // }

  async sendMessage(username: string, content: string) {
    return this.hubConnection.invoke('SendMessage', { recipientUsername: username, content: content })
      .catch(error => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
