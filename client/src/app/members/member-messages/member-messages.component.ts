import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit, OnDestroy {
  @ViewChild("messageForm") messageForm!: NgForm;
  @Input() username: string = "";
  public messages: Message[] = []
  private messagesSub: Subscription;

  public messageContent!: string;

  constructor(private messageService: MessageService) {
    this.messagesSub = this.messageService.messageThread$.subscribe(messages => {
      this.messages = messages;
    })
  }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    })
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }
}
