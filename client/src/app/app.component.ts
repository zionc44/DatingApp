import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const stringUser: string | null = localStorage.getItem("user")

    if (stringUser) {
      const user: User = JSON.parse(stringUser);
      this.accountService.setCurrentUser(user);
    } else {
      this.accountService.setCurrentUser(null);
    }
  }
}
