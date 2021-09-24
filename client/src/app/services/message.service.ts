import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';
import { UserParams } from '../models/user-params.model';
import { User } from '../models/user.model';
import { getPaginatedResult, getPaginationHeraders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getMessages(userParams: UserParams) {
    let params = getPaginationHeraders(userParams)
    params = params.append("Container", userParams.container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', { recipientUsername: username, content: content });
  }

  deleteMessage(id:number) {
    return this.http.delete(this.baseUrl+ 'messages/' + id);
  }
}
