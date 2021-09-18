import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;
  public member!: Member;
  public user: User | null = null;
  @HostListener ('window:beforeunload',['$event']) unloadNotification($event:any) {
     if (this.editForm.dirty) {
       $event.returnValue = true;
     }     
  }

  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private membersService: MembersService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }


  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this.user?.username? this.user.username : "";
    this.membersService.getMember(username).subscribe(member=> this.member = member);
  }

  updateMember() {
    this.membersService.updateMember(this.member).subscribe(()=>{
      this.toastr.success("Profile update successfully");
      this.editForm.reset(this.member);
    }) 
  }
}
