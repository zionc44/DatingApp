import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from '../models/member.model';
import { Pagination } from '../models/pagination.model';
import { UserParams } from '../models/user-params.model';
import { User } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  public members: Partial<Member[]> = [];
  public user!: User;
  public userParams!: UserParams;
  public pagination!: Pagination;

  constructor(
    private memberService: MembersService,
    private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = <User>user;
      this.userParams = new UserParams(this.user);
    })
  }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadLikes();
  }
}
