import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { Pagination } from '../models/pagination.model';
import { UserParams } from '../models/user-params.model';
import { User } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public messages: Message[] = [];
  public user!: User;
  public userParams!: UserParams;
  public pagination!: Pagination;
  public loading = false;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = <User>user;
      this.userParams = new UserParams(this.user);
    })
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.userParams).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id:number) {
    this.messageService.deleteMessage(id).subscribe(()=>{
      this.messages.splice(this.messages.findIndex(m=>m.id===id),1);
    })
  }
  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadMessages;
  }
}
