import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../models/user.model';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  private currentUser: User
  constructor(private accountService: AccountService) {
    this.currentUser = {
      username: "",
      token: ""
    }

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.currentUser = user
      }
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.currentUser.token
      }
    })
    return next.handle(request);
  }
}
