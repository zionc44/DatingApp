import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl: string = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User | null>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + "Account/login", model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          this.currentUserSource.next(user)
        }
        return user;
      })
    )
  }
  register(model: any) {
    return this.http.post<User>(this.baseUrl + "Account/register", model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          this.currentUserSource.next(user)
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User | null) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }
}
