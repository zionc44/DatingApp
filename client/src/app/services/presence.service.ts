import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private hubUrl: string = environment.hubUrl;
  private hubConnection!: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  public onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private router: Router,
    private toastr: ToastrService) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + "presence", {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect().build();

    this.hubConnection.start().catch(error => console.log(error))

    this.hubConnection.on("UserIsOnline", username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username]);
      })
    })

    this.hubConnection.on("UserIsOffline", username => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames.filter(x => x != username)]);
      })
    })

    this.hubConnection.on("GetOnlineUsers", (currentUsers: string[]) => {
      console.log("GetOnlineUsers=====>", currentUsers);
      this.onlineUsersSource.next(currentUsers);
    })

    this.hubConnection.on("NewMessageReceived", ({ username, knownAs }) => {
      this.toastr.info(knownAs + " has send you a new message!").onTap.pipe(take(1))
        .subscribe(() => this.router.navigateByUrl('/members/' + username + '?tab=3'));
    })
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }

}
