import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild("messageForm") messageForm!: NgForm;

  @Input() messages: Message[] = []
  @Input() username: string = "";

  public messageContent!: string;

  constructor(private messageServie: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageServie.sendMessage(this.username, this.messageContent).subscribe( message => {
      this.messages.push(message);
      this.messageForm.reset();
    })
  }
}
