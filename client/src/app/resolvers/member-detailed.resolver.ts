import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Member } from '../models/member.model';
import { MembersService } from '../services/members.service';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {
  constructor(private memberService: MembersService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    const username = route.paramMap.get('username')
    return this.memberService.getMember(username? username : "");
  }
}
